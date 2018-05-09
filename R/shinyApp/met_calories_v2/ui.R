# met v2

library(shiny)
library(shinydashboard) 
library(plotly)
library(RMySQL) 
library(shinycssloaders)
library(shinyWidgets)
library(shinyBS)

shinyUI(fluidPage(
  
  tags$style(HTML("@import url('https://fonts.googleapis.com/css?family=Poppins:300');")),
  tags$style(HTML("body {font-family: 'Poppins', sans-serif; line-height: 1.5;}")),
  tags$style(HTML("h2 {font-family: 'Poppins', sans-serif; line-height: 1.5;}")),
  tags$style(HTML("h4 {font-family: 'Poppins', sans-serif; line-height: 1.5;}")),
  tags$style(HTML("h3 {font-family: 'Poppins', sans-serif; line-height: 1.2; font-weight: 100}")),
  tags$style(HTML("p {font-family: 'Poppins', sans-serif; line-height: 1.3; font-weight: 300}")),
  
  dashboardPage(

    dashboardHeader(titleWidth=200,disable=TRUE
    ),
    dashboardSidebar(width=200, collapsed=TRUE,
                     sidebarMenu(id="tabs",
                       menuItem("Sports & Calories", tabName = "find_sport", icon = icon("futbol-o"))
          
                     )
    ),
    dashboardBody(
      tags$head(
        tags$style(HTML(".content-wrapper {background-color: #ffffff;}")),
        #tags$style(".small-box { background-color: #ffffff !important; color: #274C77 !important; right: 5rem;}")
        tags$style(HTML(".shiny-output-error-validation {color: #ef5b73;}"))
        ),
      bsModal("startupModal", "There are numerous physical activities, what should I choose?", "", 
              p("The Australian Department of Health recommends children age 5 to 17 to engage in activities that 
                                 strengthen muscle and bone on at least 3 days a week.", style="line-height: 1.4"),
              p("Here we've grouped physical activities into 5 categories to help you
                                 find the ideal activitiy for your child!", style="line-height: 1.4;")),
        tabItems(
          tabItem("find_sport",
                  fluidRow(
                    column(width=4,
                           box(width=NULL, background="teal", 
                               h3("Find a sport now!")
                               # h3("There are numerous physical activities, what should I choose?"),
                               # p("The Australian Department of Health recommends children age 5 to 17 to engage in activities that 
                               #   strengthen muscle and bone on at least 3 days a week.", style="line-height: 1.4"),
                               # p("Here we've grouped physical activities into 5 categories to help you
                               #   find the ideal activitiy for your child!", style="line-height: 1.4;")
                               ),
                           box(width=NULL, status="warning",
                               selectInput("group", "Select the most important factor: ", selected=NULL,
                                           c("Light activities"="Light",
                                             "Bone strengthening sports"="Bone-strengthening",
                                             "Muscle strengthening sports"="Muscle-strengthening",
                                             "Sports with high calorie burn"="Calories",
                                             "Don't feel like going out?"="Home")),
                               infoBoxOutput("group_def", width=NULL),
                               conditionalPanel(condition="input.group=='Bone-strengthening' || input.group=='Muscle-strengthening' || input.group=='Home'",
                                                selectInput("intensity", "Choose an intensity level:",
                                                            c("Light"="light",
                                                              "Moderate"="mod",
                                                              "Vigorous"="vig")),
                                                p("The talk test is a simple way to understand each intensity level."),
                                                infoBoxOutput("intensity_def", width=NULL)
                                                ),
                               
                               actionBttn("find", "Recommend!", size="sm", style="unite", no_outline=FALSE, icon=icon("paper-plane"))
                               )
                           ),
                    column(width=8, style="padding-left: 3rem;", align="center",
                           fluidRow(
                             uiOutput("recommended")
                           ),
                           fluidRow(
                             conditionalPanel(condition="input.sports!==null && input.sports!==undefined",
                                              box(width=NULL, status="warning",
                                                  column(width=3, align="center", 
                                                         knobInput(inputId="weight", label="Child's weight(kg)?",
                                                                   value = 12, min = 10, max=100, displayPrevious = TRUE,
                                                                   lineCap = "round", fgColor = "#428BCA", inputColor = "#428BCA",
                                                                   width="75%", height="80%"
                                                                   ),
                                                         knobInput(inputId="duration", label="Duration(hours)?",
                                                                   value = 1, min = 0.1, max=10, displayPrevious = TRUE,
                                                                   step=0.1, lineCap = "round",
                                                                   fgColor = "#428BCA", inputColor = "#428BCA",
                                                                   width="75%", height="80%"
                                                                   ),
                                                          actionBttn("calculate", label="Calculate!", size="sm",
                                                                      style="unite", icon=icon("calculator"))
                                                         
                                                         ),
                                                  column(width=9, align="center",
                                                         htmlOutput("calories_text", container=span),
                                                         conditionalPanel(condition="output.calories_text!==null && output.calories_text!==undefined && input.group!=='Home'",
                                                                          hr(),
                                                                          tags$br(), tags$br(),
                                                                          p("Ready to do some exercise?"), 
                                                                          p("Let's get MOOVing!", style="font-weight: bold"),
                                                                          uiOutput("near_me")
                                                                          ),
                                                         conditionalPanel(condition="output.calories_text!==null && output.calories_text!==undefined && input.group=='Home'",
                                                                          hr(),
                                                                          tags$br(), tags$br(),
                                                                          p("Ready to do some exercise?"), 
                                                                          p("Let's get MOOVing!", style="font-weight: bold")
                                                                          )
                                                         
                                                         )
                                                  )
                                              )
                             )
                           )
                    )
                  )
        )
      )
    )
  
))
