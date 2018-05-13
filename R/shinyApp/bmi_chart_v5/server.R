# bmi chart v5

library(shiny)
library(plotly)
library(RMySQL)
library(shinycssloaders)
library(shinydashboard)
library(reshape2)

# database config
options(mysql=list(
  "host"="35.189.11.78",
  "port"=3306,
  "user"="root",
  "password"="1kikJQpS0m33"
))

# database name
databaseName <- "moov"

# function to read in tables from MySQL
fetch_table <- function(tablename) {
  db <- dbConnect(MySQL(), dbname=databaseName, host=options()$mysql$host,
                  port=options()$mysql$port, user=options()$mysql$user,
                  password=options()$mysql$password)
  
  query <- sprintf("SELECT * FROM %s", 
                   tablename)
  
  data <- dbGetQuery(db, query)
  
  dbDisconnect(db)
  
  return(data)
}

# read in tables
boy_bmi <- fetch_table("cleaned_boy_bmi_v2")
girl_bmi <- fetch_table("cleaned_girl_bmi_v2")
vcams <<- fetch_table("vcams_combined")
vcams[vcams==0] <<- NA
colnames(vcams)[1] <- "category"
diet <<- fetch_table("diet")
colnames(diet)[1] <- "age"
diet <- melt(diet)

# default
BMI <<- boy_bmi
  
shinyServer(function(input, output, session) {
  ## menu buttons
  observeEvent(input$results_bttn,{
    updateTabItems(session, "tabs", "results")
  })
  observeEvent(input$diet_bttn,{
    updateTabItems(session, "tabs", "diet")
  })
  observeEvent(input$vic_bttn,{
    updateTabItems(session, "tabs", "vic")
  })
  observeEvent(input$pa_bttn,{
    updateTabItems(session, "tabs", "pa")
  })
  
  observe({
    #url <- "https://yke13.shinyapps.io/bmi_chart_v3/?gender=0&age_weeks=930&bmi=25.51&height=140&weight=50"
    query <<- parseQueryString(session$clientData$url_search)
    #query <<- parseQueryString(url)
    if(!is.null(query[["bmi"]])){
      gender <<- as.numeric(query[["gender"]])
      age_weeks <<- as.numeric(query[["age_weeks"]])
      bmi <<- as.numeric(query[["bmi"]])
      height <<- as.numeric(query[["height"]])
      weight <<- as.numeric(query[["weight"]])
      
      # switch charts
      if(gender==0){
        BMI <<- boy_bmi
        gender_text <<- "boy"
        #title <<- "BMI Age Percentiles for Boys"
      }
      else{
        BMI <<- girl_bmi
        gender_text <<- "girl"
        #title <<- "BMI Age Percentiles for Girls"
      }
      
      # calculations
      age_months <<- round(age_weeks * 0.23 / 0.5)*0.5
      closest_age <<- BMI[abs(BMI$age_months - age_months) == min(abs(age_months - BMI$age_months)), "age_months"][1]
      subset <- BMI[BMI$age_months==closest_age, ]
      L <- subset$L[1]
      M <- subset$M[1]
      S <- subset$S[1]
      closest_bmi <- subset[abs(subset$value - bmi) == min(abs(bmi - subset$value)), "value"]
      closest_percentile <- subset[subset$value==closest_bmi, "variable"]
      exact_percentile <<- round(pnorm((((bmi/M)^L) - 1) / (L*S)) * 100)
      if(exact_percentile==100) exact_percentile <<- exact_percentile - 1
      if(exact_percentile==0) exact_percentile <<- exact_percentile + 1
      group <<- subset[subset$value==closest_bmi, "group"]
      target_bmi <- subset[subset$variable=="85_percentile", "value"]
      target_weight <<- target_bmi * (height/100)**2
    }
  })
  
  # results tab #####################################################################################
  
  ###### value boxes ######
  # value box for age and gender
  output$age <- renderValueBox({
    if(gender==0) gender_text="boy"
    else gender_text="girl"
    valueBox(
      round(age_months/12), 
      paste("year old", gender_text),
      icon=icon("user"),
      color="navy"
    )
  })
  
  # value box for weight
  output$weight <- renderValueBox({
    valueBox(
      weight,
      "kg",
      icon=icon("balance-scale"),
      color="teal"
    )
  })
  
  # value box for height
  output$height <- renderValueBox({
    valueBox(
      height,
      "cm",
      icon=icon("child"),
      color="teal"
    )
  })
  
  ###### percentile bar chart ######
  output$percentile <- renderPlotly({
    
    bar <- data.frame(a=rep("a",4), group=c("A tad too skinny!", "Healthy weight range!", 
                                            "A few kilos heavier<br>than the healthy range!", 
                                            "A bit on the<br>heavier side!"),
                      values=c(4,80,10,6))
    bar$group <- factor(bar$group, levels=c("A tad too skinny!", "Healthy weight range!", 
                                            "A few kilos heavier<br>than the healthy range!", 
                                            "A bit on the<br>heavier side!"))
    
    # annotation config
    # a <- list(x = c(0), y = c(exact_percentile),
    #   text = paste("You are here!"),
    #   xref = "x", yref = "y",
    #   showarrow = TRUE, arrowhead = 6,
    #   ax = 90, ay = 0,
    #   arrowcolor="#d6d6d6"
    # )
    a <- list(x = c(exact_percentile), y = c(0),
              text = paste("Your child is here!"),
              xref = "x", yref = "y",
              showarrow = TRUE, arrowhead = 6,
              ax = 0, ay = -50,
              arrowcolor="#d6d6d6",
              font = list(color = '#264E86', size = 20)
    )
    
    # margin 
    # m <- list(l=40, r=50, b=20, t=0, pad=0)
    m <- list(l=10, r=10, b=30, t=30, pad=0)
    
    percentile_bar <- plot_ly(bar, height=150) %>%
      add_bars(x=~values, y=~a, color=~group, hovertext=~group, width=10, hoverinfo="text",
               marker=list(color=c(rgb(0,84,124, maxColorValue = 255), rgb(0,173,167, maxColorValue = 255),
                                   rgb(255,207,92, maxColorValue = 255), rgb(239,72,116, maxColorValue = 255)))) %>%
      layout(barmode="stack", annotations=a, margin=m, showlegend=FALSE,
             legend = list(orientation = 'v', y=-0.5),
             xaxis=list(title="Percentiles", showticklabels=TRUE, showgrid=FALSE, zeroline=FALSE, showline=FALSE,
                        tickvals=c(0,5, 85, 95, 100)),
             yaxis=list(title="", showticklabels=FALSE, showgrid=FALSE, zeroline=FALSE, showline=FALSE)) %>%
      config(displayModeBar=FALSE)

    # percentile_bar <- plot_ly(bar, width=260) %>%
    #   add_bars(x=~a, y=~values, color=~group, hovertext=~group, width=10, hoverinfo="text",
    #            marker=list(color=c(rgb(0,84,124, maxColorValue = 255), rgb(0,173,167, maxColorValue = 255),
    #                                rgb(255,207,92, maxColorValue = 255), rgb(239,72,116, maxColorValue = 255)))) %>%
    #   layout(barmode="stack", annotations=a, margin=m, showlegend=FALSE,
    #          legend = list(orientation = 'v', y=-0.5),
    #          yaxis=list(title="Percentiles", showticklabels=TRUE, showgrid=FALSE, zeroline=FALSE, showline=FALSE,
    #                     tickvals=c(0,5, 85, 95, 100)),
    #          xaxis=list(title="", showticklabels=FALSE, showgrid=FALSE, zeroline=FALSE, showline=FALSE)) %>%
    #   config(displayModeBar=FALSE)
    
    
    percentile_bar
  })
  ###### percentile_text ######
  output$percentile_text <- renderInfoBox({
    percentile_text <- infoBox("Current BMI Percentile", color="aqua", icon=icon("percent"),
                               p(exact_percentile, style = "font-size: 250%; line-height: 1;"),
                               href="#"
           
            )
    percentile_text$children[[1]]$attribs$class<-"action-button"
    percentile_text$children[[1]]$attribs$id<-"percentile_text_button"
    
    percentile_text
  })
  
  ###### bmi_text ######
  output$bmi_text <- renderInfoBox({
    bmi_text <- infoBox("Current BMI", icon=icon("tasks"), color="aqua",
                        tags$p(bmi, style="font-size: 250%; line-height: 1;"),
                        href="#"     
    )
    bmi_text$children[[1]]$attribs$class<-"action-button"
    bmi_text$children[[1]]$attribs$id<-"bmi_text_button"
    
    bmi_text
  })
  
  observeEvent(input$percentile_text_button, {
    toggleModal(session,"percentile_explain","open")
    })
  
  observeEvent(input$bmi_text_button, {
    toggleModal(session,"bmi_explain","open")
  })
  ###### summary ######
  output$summary <- renderInfoBox({
    if(exact_percentile<5){
      summary <- infoBox(tags$h3("Overall"),
                         tags$p("Slightly skinny!",
                                style = "font-size: 150%; font-weight: bold;"),
                         tags$p("It's important that your child gains weight in a healthy way, this means eating a", 
                                tags$a(href='http://www.education.vic.gov.au/school/parents/health/Pages/eating.aspx', 
                                       target='_blank', style="color: #ef4874", "balanced diet."), 
                                "As you focus on food, don't overlook exercise. More movement can build your child's 
                                appetite and muscle mass!", tags$br(), tags$br(),
                                "Have a look at our Nutrition and Physical Activity tabs!",
                                style="line-height: 200%; padding-right: 2rem"),
                         icon=icon("heartbeat"),
                         fill=TRUE,
                         color="blue"
                         )
    }
    
    if(5<=exact_percentile&&exact_percentile<85){
      summary <- infoBox(tags$h3("Overall"),
                         tags$p("Within a healthy weight range!", 
                                style = "font-size: 150%; font-weight: bold;"),
                         tags$p("Keep up the good work!", tags$br(), 
                                "Still, it is important to remember that children need a healthy diet and at least 60 
                                minutes of physical activity per day!", tags$br(), tags$br(),
                                "Have a look at the Nutrition and Physical Activity tabs!",
                                style="line-height: 200%; padding-right: 2rem"),
                         icon=icon("heartbeat"),
                         fill=TRUE,
                         color="olive"
      )
    }
    
    if(85<=exact_percentile&&exact_percentile<95){
      summary <- infoBox(tags$h3("Overall"),
                         tags$p(formatC(weight-target_weight, digits=1, format="f"), "kg over the healthly weight range!",
                                style = "font-size: 150%; font-weight: bold;"),
                         tags$p("It is not recommended that children should lose weight if they are a bit overweight, 
                                but rather slow their weight gain compared to height growth.", tags$br(),
                                "Other then an appropriate diet, make sure your child is getting 60 minutes of exercise per day!",
                                tags$br(), tags$br(),
                                "Have a look at the Nutrition and Physical Activity tabs!",
                                style="line-height: 200%; padding-right: 2rem"),
                         icon=icon("heartbeat"),
                         fill=TRUE,
                         color="yellow"
                 )
    }
    
    if(95<=exact_percentile){
      summary <- infoBox(tags$h3("Overall"),
                         tags$p("A bit on the heavier side!", 
                                style = "font-size: 150%; font-weight: bold;"),
                         tags$p("However, BMI is not able to disinguish between fat and muscle, more measurements would be needed
                                to tell the whole story.", tags$br(),
                                "Nevertheless, your child should be eating a healthy diet and getting at least 60 minutes
                                of exercise per day!", tags$br(), tags$br(),
                                "Have a look at the Nutrition and Physical Activity tabs!",
                                style="line-height: 200%; padding-right: 2rem"),
                         icon=icon("heartbeat"),
                         fill=TRUE,
                         color="maroon"
                 )
    }
    
    summary
    
  })
  # diet tab ##################################################################################################
  observeEvent(c(input$age_group, input$gender, event_data("plotly_click", source="pie")),{
    
    event <- event_data("plotly_click", source="pie")
    #diet <- melt(diet)
    subset <- diet[(diet$age==input$age_group) & (diet$gender==input$gender), ]
    
    output$pie <- renderPlotly({
          
      colors <- c('rgb(0,161,98)', 'rgb(255,166,0)', 'rgb(75,88,167)', 'rgb(255,77,102)', 'rgb(36,150,216)')
      
      pie <- plot_ly(subset, labels=~variable, values=~value, type="pie", source="pie", 
                     textinfo="label", insidetextfont = list(color = '#FFFFFF'),
                     text = ~paste("Serves:", value),
                     hoverinfo="text", hoverlabel=list(font=list(color= "white")),
                     marker = list(colors = colors,
                                   line = list(color = '#FFFFFF', width = 1))) %>%
        layout(margin=list(l=-20, r=100), 
               title=paste("Serves per food group for a", input$age_group, "year old", input$gender)) %>%
        config(displayModeBar=FALSE)
      
      pie
    })
    
    output$serves <- renderInfoBox({
      if(!is.null(event)){
        if(event[2]==0){
          title <- paste("Vegetables:", subset[subset$variable=="Vegetables", "value"], "serves")
          serves <- infoBox(tags$h3(title),
                            tags$p("1 serve", tags$br(),
                                   "= 0.5 cup of fresh, cooked or canned vegetables", tags$br(),
                                   "= half a medium-sized potato", tags$br(), 
                                   "= 1 cup of salad leaves",
                                   style="line-height: 200%; font-size: 90%"),
                            icon=icon("check"),
                            fill=FALSE,
                            color="green"
                            )
        }
        if(event[2]==1){
          title <- paste("Fruit:", subset[subset$variable=="Fruit", "value"], "serves")
          serves <- infoBox(tags$h3(title),
                            tags$p("1 serve", tags$br(),
                                   "= 1 medium-sized fruit (e.g. apple or banana)", tags$br(),
                                   "= 2 small fruit (e.g. apricot or kiwi)", tags$br(),
                                   "= 1 cup of canned fruit",
                                   style="line-height: 200%; font-size: 90%"),
                            icon=icon("check"),
                            fill=FALSE,
                            color="yellow"
          )
        }
        if(event[2]==2){
        
          title <- paste("Cereals:", subset[subset$variable=="Cereals", "value"], "serves")
          serves <- infoBox(tags$h3(title),
                            tags$p("1 serve", tags$br(),
                                   "= 1 slice of bread", tags$br(), 
                                   "= 0.5 cup of cooked rice, pasta or noodles", tags$br(),
                                   "= 2/3 cup of breakfast cereal",
                                  style="line-height: 200%; font-size: 90%"),
                            icon=icon("check"),
                            fill=FALSE,
                            color="purple"
          )
        }
        if(event[2]==3){
        
          title <- paste("Protein:", subset[subset$variable=="Protein", "value"], "serves")
          serves <- infoBox(tags$h3(title),
                            tags$p("1 serve", tags$br(),
                                   "= 65 g cooked lean beef, lamb or pork", tags$br(),
                                   "= 80 g of chicken; 100 g of tuna", tags$br(),
                                   "= 2 large eggs", tags$br(),
                                   "= 1 cup of baked beans",
                                   style="line-height: 200%; font-size: 90%"),
                            icon=icon("check"),
                            fill=FALSE,
                            color="maroon"
          )
        }
        if(event[2]==4){
        
          title <- paste("Dairy:", subset[subset$variable=="Dairy", "value"], "serves")
          serves <- infoBox(tags$h3(title),
                            tags$p("1 serve", tags$br(),
                                   "= 1 cup of milk", tags$br(),
                                   "= 2 slices cheese", tags$br(),
                                   "= 3/4 cup of yogurt",
                                   style="line-height: 200%; font-size: 90%"),
                            icon=icon("check"),
                            fill=FALSE,
                            color="light-blue"
          )
        }
      }
      else{
        serves <- infoBox(tags$h3("Servings Info"),
                          tags$p("Click on different food groups on the pie chart!",
                                 style="line-height: 200%; font-size: 90%"),
                          icon=icon("exclamation"),
                          fill=FALSE,
                          color="teal"
        )
      }
      serves
    })
    
  })
  
  # victorian children tab #####################################################################################
  
  observeEvent(c(input$choice, input$filter),{
  
    output$plot <- renderPlotly({
      ###### weight ######
      if(input$choice=="vic_weight"){
        vic_weight <- data.frame(cat=vcams$sub_cat, underweight=vcams$underweight, overweight=vcams$overweight)
        vic_weight <- na.omit(vic_weight)
        vic_weight$cat <- factor(vic_weight$cat, levels=c("Victoria", "Metropolitan", "Regional",
                                                          "Female", "Male", "Year 5", "Year 8", "Year 11"))
        vic <- c("Victoria", "Metropolitan", "Regional")
        gen <- c("Female", "Male")
        year <- c("Year 5", "Year 8", "Year 11")
        
        ###### area ######
        if(input$filter=="area"){
          plot <- plot_ly(vic_weight[vic_weight$cat %in% vic, ]) %>% 
            add_bars(x=~cat, y=~overweight, name="Overweight") %>%
            add_trace(x=~cat,y=~underweight, name="Underweight", type="bar") %>%
            layout(barmode="group", hovermode="x", orientation="h",
                   title="Proportion of Victorian children that are overweight or underweight",
                   xaxis=list(title="Area"),
                   yaxis=list(title="Percentage", tickformat = ".1%")) %>%
            config(displayModeBar=FALSE)
        }
        
        ###### gender ######
        if(input$filter=="gender"){
          plot <- plot_ly(vic_weight[vic_weight$cat %in% gen, ]) %>% 
            add_bars(x=~cat, y=~overweight, name="Overweight", marker = list(color = 'rgb(31,119,180)')) %>%
            add_trace(x=~cat,y=~underweight, name="Underweight", type="bar", marker = list(color = 'rgb(255,127,14)')) %>%
            layout(barmode="group",
                   xaxis=list(title="Gender"), hovermode="x", showlegend=TRUE, 
                   title="Proportion of Victorian children that are overweight or underweight",
                   yaxis=list(title="Percentage", tickformat = ".1%")) %>%
            config(displayModeBar=FALSE)
        }
        
        ###### age ######
        if(input$filter=="age"){
          plot <- plot_ly(vic_weight[vic_weight$cat %in% year, ],
                          x=~cat, y=~overweight, name="Overweight", 
                          type="scatter", mode="lines+markers", 
                          marker=list(color='rgb(31,119,180)'), 
                          line=list(color='rgb(31,119,180)')) %>% 
            add_trace(x=~cat,y=~underweight, name="Underweight", 
                      marker=list(color='rgb(255,127,14)'), 
                      line=list(color='rgb(255,127,14)')) %>%
            layout(xaxis=list(title="Age"), hovermode='x', showlegend=TRUE,
                   title="Proportion of Victorian children that are overweight or underweight",
                   yaxis=list(title="Percentage", tickformat = ".1%")) %>%
            config(displayModeBar=FALSE)
        }
      }
      
      ##############################
      
      ###### pa ######
      if(input$choice=="vic_pa"){
        pa <- data.frame(cat=vcams$category, sub_cat=vcams$sub_cat, pa=vcams$physical_activity)
        pa <- na.omit(pa)
        pa$cat <- as.character(pa$cat)
        pa$sub_cat <- as.character(pa$sub_cat)
        
        gen <- c("Female", "Male")
        year <- c("Year 5", "Year 8", "Year 11")
        area <- c("Victoria", "Metropolitan", "Regional")
        
        ###### area ######
        if(input$filter=="area"){
          if(input$area_filter=="overall"){
            plot <- plot_ly(pa[pa$sub_cat %in% area, ], source="area",
                            x=~reorder(sub_cat,pa), y=~pa, color=~sub_cat, type="bar", orientation="v", 
                            hoverinfo="x+y") %>%
              layout(hovermode="x", showlegend=FALSE,
                     yaxis=list(title="Percentage", tickformat = ".1%"),
                     title="Proportion of Children Getting Required Exercise in Victoria",
                     xaxis=list(title="Area")) %>%
              config(displayModeBar=FALSE)
          }
          if(input$area_filter=="metro"){
            plot <- plot_ly(pa[pa$cat=="metropolitan", ],
                            y=~reorder(sub_cat,pa), x=~pa, type="bar", orientation="h", hoverinfo="x+y",
                            marker = list(color = 'rgba(102,194,165,1.0)')) %>%
              layout(hovermode="y", margin=list(l=155, r=5),
                     yaxis=list(title="", showticklabels=TRUE), 
                     title="Proportion of Children Getting Required Exercise in Metropolitan Areas",
                     xaxis=list(title="Percentage", tickformat = ".1%")) %>%
              config(displayModeBar=FALSE)
          }
          if(input$area_filter=="reg"){
            plot <- plot_ly(pa[pa$cat=="regional", ],
                            y=~reorder(sub_cat,pa), x=~pa, type="bar", orientation="h", hoverinfo="x+y",
                            marker = list(color = 'rgba(252,141,98,1.0)')) %>%
              layout(hovermode="y", margin=list(l=155, r=5), 
                     title="Proportion of Children Getting Required Exercise in Regional Areas",
                     yaxis=list(title="", showticklabels=TRUE),
                     xaxis=list(title="Percentage", tickformat = ".1%")) %>%
              config(displayModeBar=FALSE)
          }
          if(input$area_filter=="vic"){
          
            plot <- plot_ly(pa[!(pa$sub_cat %in% year) & !(pa$sub_cat %in% gen) & !(pa$sub_cat %in% area), ],
                            y=~reorder(sub_cat,pa), x=~pa, type="bar", orientation="h",hoverinfo="x+y",
                            color=~cat) %>%
              layout(hovermode="y",  margin=list(l=155, r=5),
                     legend=list(orientation="h"),
                     yaxis=list(title="", showticklabels=TRUE), 
                     title="Comparison of Metropolitan and Regional Areas",
                     xaxis=list(title="Percentage", tickformat = ".1%")) %>%
              config(displayModeBar=FALSE)
          }
        }
        if(input$filter=="gender"){
          plot <- plot_ly(pa[pa$sub_cat %in% gen, ], x=~reorder(sub_cat, -pa), y=~pa, hoverinfo="x+y",
                          type="bar",
                          marker = list(color = 'rgba(231,138,195,1.0)')) %>% 
            layout(xaxis=list(title="Gender"), hovermode='x', showlegend=FALSE, 
                   title="Proportion of Victorian children getting the required amount of exercise",
                   yaxis=list(title="Percentage", tickformat = ".1%")) %>%
            config(displayModeBar=FALSE)
        }
        if(input$filter=="age"){
          plot <- plot_ly(pa[pa$sub_cat %in% year, ], x=~reorder(sub_cat, -pa), y=~pa, hoverinfo="x+y",
                          type="scatter", mode="lines+markers",
                          marker = list(color = 'rgba(231,138,195,1.0)'),
                          line = list(color = 'rgba(231,138,195,1.0)')) %>% 
            layout(xaxis=list(title="Age"), hovermode='x', showlegend=FALSE,
                   title="Proportion of Victorian children getting the required amount of exercise",
                   yaxis=list(title="Percentage", tickformat = ".1%")) %>%
            config(displayModeBar=FALSE)
        }
      }

      plot
    })
    
    output$info <- renderInfoBox({
      if(input$choice=="vic_weight"){
        if(input$filter=="area"){
          info <- infoBox(tags$h3("Analysis"),
                      tags$p("While 66% of Victorian students are within the healthy BMI range for their
                             age and gender, the study found that around one in
                             four are overweight and around 7% are underweight",
                             style="line-height: 150%; font-size: 80%"),
                      icon=icon("bar-chart"),
                      fill=FALSE,
                      color="aqua")
        }
        if(input$filter=="gender"){
          info <- infoBox(tags$h3("Analysis"),
                          tags$p("Boys are slightly more likely to be overweight or underweight compared to girls.",
                                 style="line-height: 150%; font-size: 80%"),
                          icon=icon("bar-chart"),
                          fill=FALSE,
                          color="aqua")
        }
        if(input$filter=="age"){
          info <- infoBox(tags$h3("Analysis"),
                          tags$p("Rates of students who are overweight increased slightly with school year level, from
                                 25% in Year 5, to 29% in Year 8, and 30% in year 11.",
                                 style="line-height: 150%; font-size: 80%"),
                          icon=icon("bar-chart"),
                          fill=FALSE,
                          color="aqua")
        }
      }
      if(input$choice=="vic_pa"){
        if(input$filter=="area"){
          if(input$area_filter=="overall"){
            info <- infoBox(tags$h3("Analysis"),
                          tags$p("Only around 26% of Victorian students are getting the required 60 minutes of exercise 
                                 per day.",
                                 style="line-height: 150%; font-size: 80%"),
                          icon=icon("bar-chart"),
                          fill=FALSE,
                          color="aqua")
          }
          if(input$area_filter=="metro"){
            info <- infoBox(tags$h3("Analysis"),
                            tags$p("Out of all the metropolitan areas in Victoria, Western Melbourne Area had the highest 
                                   proportion of students doing the recommended amount of exercise, while Southern Melbourne Area
                                   had the lowest.",
                                   style="line-height: 150%; font-size: 80%"),
                            icon=icon("bar-chart"),
                            fill=FALSE,
                            color="aqua")
          }
          if(input$area_filter=="reg"){
            info <- infoBox(tags$h3("Analysis"),
                            tags$p("Out of all the regional areas in Victoria, Ovens Murray Area had the highest 
                                   proportion of students doing the recommended amount of exercise, while Western District Area
                                   had the lowest.",
                                   style="line-height: 150%; font-size: 80%"),
                            icon=icon("bar-chart"),
                            fill=FALSE,
                            color="aqua")
          }
          if(input$area_filter=="vic"){
            info <- infoBox(tags$h3("Analysis"),
                            tags$p("Out of all the areas in Victoria, Ovens Murray Area (Regional) had the highest 
                                   proportion of students doing the recommended amount of exercise, while Southern Melbourne Area
                                   (Metropolitan) had the lowest.",
                                   style="line-height: 150%; font-size: 80%"),
                            icon=icon("bar-chart"),
                            fill=FALSE,
                            color="aqua")
          }
        }
        if(input$filter=="gender"){
          info <- infoBox(tags$h3("Analysis"),
                          tags$p("Boys are more likely to do the required amount of exercise compared to girls.",
                                 style="line-height: 150%; font-size: 80%"),
                          icon=icon("bar-chart"),
                          fill=FALSE,
                          color="aqua")
        }
        if(input$filter=="age"){
          info <- infoBox(tags$h3("Analysis"),
                          tags$p("Rates of students who are getting the required amount of exercise decreased drastically 
                                 with school year level, from 32% in Year 5, to 17% in Year 8, and 12% in year 11.",
                                 style="line-height: 150%; font-size: 80%"),
                          icon=icon("bar-chart"),
                          fill=FALSE,
                          color="aqua")
        }
      }
      
      info
                      
    })
  })
})
