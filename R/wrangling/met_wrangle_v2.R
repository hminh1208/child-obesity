# lib
library(readxl)
library(dplyr)
library(zoo)

met <- read_xls("met_abs.xls", sheet="Child PA classification", range="B6:F461",
                col_names=c("broad_group","pa_group","detailed_group","abs","met"))

# drop abs column
met <- met[, c("broad_group","pa_group","detailed_group","met")]

# drop rows with all NA
met <- met %>% filter(rowSums(is.na(.)) != ncol(.))

# replace NAs in MET and detailed_group with string "drop" so that they won't be forward filled in the next step
met[is.na(met$met), "met"] <- "drop"
met[is.na(met$detailed_group), "detailed_group"] <- "drop"

# forward fill NAs
met <- na.locf(met)

# drop rows containing "drop"
met <- met[!grepl("drop", met$met),]

# renaming values
met[met$pa_group=="Fitness / gym", "pa_group"] <- "Fitness / Gymnasium Workouts"
met[met$pa_group=="Horse racing", "pa_group"] <- "Equestrian"
met[met$pa_group=="Horse riding / equestrian activities / polo", "pa_group"] <- "Equestrian"
met[met$pa_group=="Harness racing", "pa_group"] <- "Equestrian"
met[met$pa_group=="Athletics, track and field", "pa_group"] <- "Athletics"
met[met$pa_group=="Gymnastics / circus activities", "pa_group"] <- "Gymnastics"
met[met$pa_group=="Skateboarding / inline hockey / roller sports", "pa_group"] <- "Skating"
met[met$pa_group=="Dancing / ballet", "pa_group"] <- "Dancing"
met[met$pa_group=="Light martial arts", "pa_group"] <- "Martial Arts"
met[met$pa_group=="Table tennis", "pa_group"] <- "Table Tennis"
met[met$pa_group=="Swimming / diving", "pa_group"] <- "Swimming"
met[met$pa_group=="Tenpin bowling", "pa_group"] <- "Ten Pin Bowling"
met[met$pa_group=="Minigolf", "pa_group"] <- "Golf"
met[met$pa_group=="Martial arts", "pa_group"] <- "Martial Arts"
met[met$pa_group=="Surf lifesaving", "pa_group"] <- "Surf Life Saving"
met[met$pa_group=="Rugby league", "pa_group"] <- "Rugby League"
met[met$pa_group=="Rugby union", "pa_group"] <- "Rugby Union"
met[met$pa_group=="Rock climbing / abseiling / caving", "pa_group"] <- "Rock Climbing"
met[met$pa_group=="Lawn bowls", "pa_group"] <- "Lawn Bowls"
met[met$pa_group=="Aerobics / exercising (other)", "pa_group"] <- "Aerobics"
met[met$pa_group=="Australian Rules football", "pa_group"] <- "Football"
met[met$pa_group=="Beach volleyball", "pa_group"] <- "Beach Volleyball"
met[met$pa_group=="Carpet bowls", "pa_group"] <- "Carpet Bowls"
met[met$pa_group=="Bush walking / walking for exercise", "pa_group"] <- "Walking"
met[met$pa_group=="Walking for transport", "pa_group"] <- "Walking"
met[met$pa_group=="Riding bike for transport", "pa_group"] <- "Cycling"
met[met$pa_group=="Basketball (indoor & outdoor)", "pa_group"] <- "Basketball"
met[met$pa_group=="Cricket (indoor)", "pa_group"] <- "Cricket"
met[met$pa_group=="Cricket (outdoor)", "pa_group"] <- "Cricket"
met[met$pa_group=="Cross country running", "pa_group"] <- "Running"
met[met$pa_group=="Hockey (indoor & outdoor)", "pa_group"] <- "Hockey"
met[met$pa_group=="Lacrosse (indoor & outdoor)", "pa_group"] <- "Lacrosse"
met[met$pa_group=="Netball (indoor & outdoor)", "pa_group"] <- "Netball"
met[met$pa_group=="Soccer (indoor)", "pa_group"] <- "Futsal"
met[met$pa_group=="Soccer (outdoor)", "pa_group"] <- "Soccer"
met[met$pa_group=="Softball / tee ball", "pa_group"] <- "Softball"
met[met$pa_group=="Tennis (indoor & outdoor)", "pa_group"] <- "Tennis"
met[met$pa_group=="Volleyball (indoor & outdoor)", "pa_group"] <- "Volleyball"
met[met$pa_group=="Jogging / running", "pa_group"] <- "Running"
met[(met$pa_group=="Cycling / BMXing (not exercise bike cycling or spin cycling)") & (met$detailed_group=="Bike riding"), "pa_group"] <- "Cycling"
met[(met$pa_group=="Cycling / BMXing (not exercise bike cycling or spin cycling)") & (met$detailed_group=="BMXing"), "pa_group"] <- "BMX"
met[(met$pa_group=="Cycling / BMXing (not exercise bike cycling or spin cycling)") & (met$detailed_group=="Cycling"), "pa_group"] <- "Cycling"
met[(met$pa_group=="Cycling / BMXing (not exercise bike cycling or spin cycling)") & (met$detailed_group=="Mountain biking"), "pa_group"] <- "Cycling"

# integrate with available sport facilities
sports <- read.csv("sports_subset.csv", header=TRUE, stringsAsFactors = FALSE)
sport_list <- unique(sports$sport)

pa_group_list <- unique(met$pa_group)
detailed_group_list <- unique(met$detailed_group)

#setdiff(pa_group_list, sport_list)
#setdiff(sport_list, pa_group_list)

# create dataframe of sport and corresponding met values 
sports_met <- data.frame(category=NULL, type=NULL, met=NULL, stringsAsFactors = FALSE)

for(i in seq_along(sport_list)){
  sport <- sport_list[i]
  # check if sport in pa_group
  if(sport %in% pa_group_list){
    subset <- met[met$pa_group==sport, ]
    df <- data.frame(category=rep(sport, nrow(subset)), type=subset$detailed_group, met=subset$met)
    sports_met <- rbind(sports_met, df)
  }
  else{
    # check if sport in detailed_group 
    if(sport %in% detailed_group_list){
      subset <- met[met$detailed_group==sport, ]
      df <- data.frame(category=rep(sport, nrow(subset)), type=subset$detailed_group, met=subset$met)
      sports_met <- rbind(sports_met, df)
    }
  }
}

# add Active household chores and Gardening
subset <- met[met$pa_group=="Active household chores", ]
df <- data.frame(category=rep("Active household chores", nrow(subset)),
                 type=subset$detailed_group,
                 met=subset$met)
sports_met <- rbind(sports_met, df)

subset <- met[met$pa_group=="Gardening", ]
df <- data.frame(category=rep("Gardening", nrow(subset)),
                 type=subset$detailed_group,
                 met=subset$met)
sports_met <- rbind(sports_met, df)

sports_met$category <- as.character(sports_met$category)
sports_met$type <- as.character(sports_met$type)
sports_met$met <- as.numeric(as.character(sports_met$met))

sports_met$intensity <- ""
sports_met[sports_met$met<=3, "intensity"] <- "light"
sports_met[(sports_met$met>3) & (sports_met$met<6), "intensity"] <- "mod"
sports_met[sports_met$met>=6, "intensity"] <- "vig"

# add group
bone <- c("Acrobatics","Australian rules football","Athletics, track & field","Badminton","Ballet","Baseball",
          "Basketball","Bush walking","Chi Kung","Cricket","Dodgeball","Futsal","Gymnastics","Hockey","Hopscotch",
          "Jogging","Judo/ Jujitsu","Karate","Kickboxing","Lacrosse","Netball","Racquet ball","Running","Skipping / jump rope",
          "Soccer","Softball","Softcrosse","Squash","Taekwondo","Tennis","Trampolining","Volleyball","Walking for exercise",
          "Walking the dog")
muscle <- c("Australian rules football","Acrobatics","Basketball","Bike riding","BMXing","Circuits","Cross trainer machine",
            "Cycling","Exercise biking","Fitness centre activities","Futsal","Gymnasium workouts","Gymnastics",
            "Horse riding / equestrian activities","Inline hockey","Monkey bars","Rock climbing","Roller-blading",
            "Roller-skating","Rowing (stationary)","Show jumping","Skateboarding","Soccer","Stairclimber",
            "Surf lifesaving / royal lifesaving","Swimming","Tennis")
light <- c("Acrobatics","Ballet","Croquet","Golf","Gymnastics","Minigolf","Putt-putt golf","Rowing (stationary)",
           "Swimming","Table Tennis","Volleyball")
home <- c("Carrying groceries upstairs","Carrying heavy items","Dusting","Gardening","Making the bed","Mopping",
          "Moving furniture","Mowing the lawn","Picking flowers, fruit etc.","Raking","Scrubbing floors",
          "Shovelling / digging","Sweeping","Tidying / cleaning room","Unpacking boxes","Vacuuming","Washing car or windows",
          "Weeding","Wheelbarrowing","Yardwork")
calories <- c("Basketball","Boxing","Chi Kung","Jogging","Judo/ Jujitsu","Karate","Kickboxing","Mountain biking",
              "Netball","Running","Taekwondo")

df <- data.frame(category=NULL, type=NULL, group=NULL, met=NULL, intensity=NULL,stringsAsFactors = FALSE)

for(i in 1:nrow(sports_met)){
  sport <- sports_met$type[i]
  if(sport %in% bone){
    row <- data.frame(category=sports_met$category[i], type=sports_met$type[i], group="Bone-strengthening",
                      met=sports_met$met[i], intensity=sports_met$intensity[i])
    df <- rbind(df, row)
  }
  if(sport %in% muscle){
    row <- data.frame(category=sports_met$category[i], type=sports_met$type[i], group="Muscle-strengthening",
                      met=sports_met$met[i], intensity=sports_met$intensity[i])
    df <- rbind(df, row)
  }
  if(sport %in% light){
    row <- data.frame(category=sports_met$category[i], type=sports_met$type[i], group="Light",
                      met=sports_met$met[i], intensity=sports_met$intensity[i])
    df <- rbind(df, row)
  }
  if(sport %in% home){
    row <- data.frame(category=sports_met$category[i], type=sports_met$type[i], group="Home",
                      met=sports_met$met[i], intensity=sports_met$intensity[i])
    df <- rbind(df, row)
  }
  if(sport %in% calories){
    row <- data.frame(category=sports_met$category[i], type=sports_met$type[i], group="Calories",
                      met=sports_met$met[i], intensity=sports_met$intensity[i])
    df <- rbind(df, row)
  }
}

write.csv(df, file="sports_met.csv", row.names = FALSE)




