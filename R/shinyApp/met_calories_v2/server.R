# met v2

# load libraries
library(shiny)
library(shinydashboard) 
library(plotly)
library(RMySQL) 
library(shinycssloaders)
library(shinyWidgets)
library(shinyBS)

# database config
options(mysql=list(
  "host"="35.189.11.78",
  "port"=3306,
  "user"="root",
  "password"="1kikJQpS0m33"
))

# database name
databaseName <- "sport_fac"

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
sports_met <<- fetch_table("sports_met")
macca <<- fetch_table("macca_cleaned")

##### function for generating choices #####
choices <- function(dataframe){
  df <- data.frame(cname=unique(dataframe$pa_group), keys=unique(dataframe$pa_group), stringsAsFactors = FALSE)
  chlst <- df$keys
  names(chlst) <- df$cname
  return(chlst)
}

##### macca function #####
food_result <- function(met, kg, hour){
  target <- met*kg*hour
  candidates <- data.frame()
  if(target < 44){
    num <- as.numeric(target / 44)
    df <- data.frame("product"="Chicken McNugget(s)", num=round(num/0.5)*0.5, size="NA")
    candidates <- rbind(candidates, df)
  }
  
  if(target>=44){
    for(i in 1:nrow(macca)){
      num <- as.numeric(target / macca[i, "energy_cal"])
      if(num > 1){
        df <- data.frame(product=macca[i, "product"], num=round(num/0.5)*0.5, size=macca[i, "size"])
        candidates <- rbind(candidates, df)
      }
    }
  }
  
  return(candidates[sample(nrow(candidates),1),])
}

########################################### shiny sever start ###############################################3

shinyServer(function(input, output, session) {
  toggleModal(session, "startupModal", toggle = "open")
  
  ############ sport finder ############
  
  # for rendering infoboxes
  observeEvent(c(input$group, input$intensity),{
    output$group_def <- renderInfoBox({
      switch(input$group,
             "Light"=infoBox(tags$b("Light Activities"), color="olive", icon=icon("flag-o"),
                             p("These activities are light and easy paced.", style="font-size: 80%")),
             "Bone-strengthening"=infoBox(tags$b("Bone-strengthening"), color="purple", icon=icon("bullhorn"),
                                          p("These activities produce an impact or tension force on the bones that promotes bone growth and strength.",
                                            style="font-size: 80%")),
             "Muscle-strengthening"=infoBox(tags$b("Muscle-strengthening"), color="teal", icon=icon("shield"),
                                            p("These activities require children to lift their own body weight or to work against a resistance.",
                                              style="font-size: 80%")),
             "Calories"=infoBox(tags$b("Sports with high calorie burn"), color="maroon", icon=icon("bolt"),
                                p("If you're looking to get the most calorie burn out of 1 session, then these sports are the perfect choice!",
                                  style="font-size: 80%")),
             "Home"=infoBox(tags$b("Don't feel like going out?"), color="aqua", icon=icon("home"),
                            p("Even household chores or gardening can be good physical activities for your child!",
                              style="font-size: 80%"))
             )
    })
    
    output$intensity_def <- renderInfoBox({
      switch(input$intensity,
             "light"=infoBox(tags$b("Intensity Level: Light"), color="green", icon=icon("check"),
                             p("Will be able to talk effortlessly.",
                             style="font-size: 80%")),
             "mod"=infoBox(tags$b("Intensity Level: Moderate"), color="orange", icon=icon("check"),
                           p("Will be able to talk but not sing during the activity.",
                             style="font-size: 80%")),
             "vig"=infoBox(tags$b("Intensity Level: Vigorous"), color="red", icon=icon("check"),
                           p("Will not be able to say more than a few words without pausing for a breath.",
                             style="font-size: 80%")))

    })

  })
  
  # reaction for clicking "find" button
  subset_df <- eventReactive(input$find,{
    if(input$group=="Light") {
      df <- sports_met[(sports_met$group==input$group), ]
    }
    if(input$group=="Calories"){
      df <- sports_met[(sports_met$group==input$group), ]
    }
    if(input$group=="Bone-strengthening" || input$group=="Muscle-strengthening" || input$group=="Home"){
      df <- sports_met[(sports_met$group==input$group) & (sports_met$intensity==input$intensity), ]
    }
    
    df
  })

  
  # for rendering sport buttons
  output$recommended <- renderUI({
    subset <- subset_df()
    
    if(nrow(subset)==0){
      heading <- "Opps! We cannot find anything that satisfies your search critera"
      text <- "Please try changing the intensity level!"
      }
    
    else{
      heading <- p("Here are some sports(activities) that satisfy your search criteria")
      text <- "Click on individual sports(or physical activities) to calculate calorie burns."
    }
    if(nrow(subset)>5) subset <- subset[sample(nrow(subset), 5), ]
    box(width=NULL, status="warning",
        h3(heading), 
        p(text),
        tags$br(),
        radioGroupButtons("sports", status="primary", selected=character(0), justified=FALSE, individual=TRUE, 
                      checkIcon=list(yes = icon("check", lib = "font-awesome")),
                      choiceNames=subset$type, choiceValues=subset$type)
        )
    
  })
  
  # reaction for clicking "calculate"
  calculate <- eventReactive(input$calculate,{
    input$weight*sports_met[sports_met$type==input$sports, "met"][1]*input$duration
  })
  
  selected_sport <- eventReactive(input$calculate,{
    input$sports
  })
  
  selected_duration <- eventReactive(input$calculate,{
    input$duration
  })
  
  macca_result <- eventReactive(input$calculate,{
    met <- sports_met[sports_met$type==input$sports, "met"][1]
    food_item <- food_result(met=met, kg=input$weight, hour=input$duration)
    food_item
  })
  
  # render calorie text
  output$calories_text <- renderText({
    cal <- calculate()
    sport <- selected_sport()
    duration <- selected_duration()
    food_item <- macca_result()
    if(food_item$size=="NA"){
      text <- paste(h3(tags$b(sport, ": ",duration, "hour(s)")),
                    h2(cal, "Calories Burned"), hr(),
                    p("To help you get a feel of what this means..."),
                    p(cal, "Cal = ", food_item$num, food_item$product, "!", 
                      style="font-weight: bold; color: #ef5b5b; font-size: 230%")
                    )
    }
    else{
      text <- paste(h3(tags$b(sport, ": ",duration, "hour(s)")),
                    h2(cal, "Calories Burned"), hr(),
                    p("To help you get a feel of what this means..."),
                    p(cal, "Cal = ", food_item$num, food_item$size, food_item$product, "!", 
                      style="font-weight: bold; color: #ef5b5b; font-size: 230%")
                    )
    }
    text
          
  })

  # reaction for "find it near me" button
  observeEvent(input$sports,{
    output$near_me <- renderUI({
      category <- as.character(sports_met[sports_met$type==input$sports, "category"])
      url <- paste("http://moovmoov.ml/website/faces/facility.xhtml?type=suggest&sport=", category, sep="")
      
      tags$a(href=url, target="_blank", "Find it near me!", style="font-size: 14pt;", icon=icon("map-marker"))
      
    # actionBttn("near_me", size="sm",
    #            label=tags$a(href=url, target='_blank',
    #                         "Find it near me!"),
    #            style="unite", icon=icon("map-marker"))
    })
  })
})
