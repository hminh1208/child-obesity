
library(readr)

met <- read_csv("met.csv")
sports <- read.csv("sports_subset.csv", header=TRUE, stringsAsFactors = FALSE)
sport_list <- unique(sports$sport)

# modify some column names
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
met[met$pa_group=="Rock climbing", "pa_group"] <- "Rock Climbing"
met[met$pa_group=="Lawn bowls", "pa_group"] <- "Lawn Bowls"
met[met$pa_group=="Aerobics / exercising", "pa_group"] <- "Aerobics"
met[met$pa_group=="Australian Rules football", "pa_group"] <- "Football"
met[met$pa_group=="Beach volleyball", "pa_group"] <- "Beach Volleyball"
met[met$pa_group=="Carpet bowls", "pa_group"] <- "Carpet Bowls"
met[met$pa_group=="Bush walking / walking for exercise", "pa_group"] <- "Walking"

# write.csv(met, "met_cleaned.csv", row.names=FALSE)


pa_group_list <- unique(met$pa_group)
detailed_group_list <- unique(met$detailed_group)

setdiff(pa_group_list, sport_list)

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

# add active household chores to sports_met
subset <- met[met$pa_group=="Active household chores", ]
df <- data.frame(category=rep("Active household chores", nrow(subset)),
                 type=subset$detailed_group,
                 met=subset$met)
sports_met <- rbind(sports_met, df)
sports_met$category <- as.character(sports_met$category)
sports_met$type <- as.character(sports_met$type)
sports_met$met <- as.character(sports_met$met)

sports_met$intensity <- ""
sports_met[sports_met$met<=3, "intensity"] <- "light"
sports_met[(sports_met$met>3) & (sports_met$met<6), "intensity"] <- "mod"
sports_met[sports_met$met>6, "intensity"] <- "vig"

write.csv(sports_met, "sports_met.csv", row.names = FALSE)
