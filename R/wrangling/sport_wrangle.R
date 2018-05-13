# libs
library(dplyr)


# LGAs
lga <- c("Melbourne", "Port Phillip", "Stonnington", "Yarra", "Banyule", "Bayside", "Boroondara", "Brimbank", "Darebin",
         "Glen Eira", "Hobsons Bay", "Kingston", "Manningham", "Maribyrnong", "Monash", "Moonee Valley", "Moreland",
         "Whitehorse", "Cardinia", "Casey", "Frankston", "Greater Dandenong", "Hume", "Knox", "Maroondah", "Melton",
         "Mornington Peninsula", "Nillumbik", "Whittlesea", "Wyndham", "Yarra Ranges")
lga <- toupper(lga)

# read in csv
df <- read.csv("sport_rec_facilities.csv", stringsAsFactors = FALSE)
 
# drop x,y
sports <- data.frame("id"=df$Facility_ID,
                     "lat"=df$Latitude,
                     "lon"=df$Longitude,
                     "name"=df$FacilityName,
                     "street_no"=df$StreetNo,
                     "street_name"=df$StreetName,
                     "street_type"=df$StreetType,
                     "suburb"=df$SuburbTown,
                     "postcode"=df$Postcode,
                     "sport"=df$SportsPlayed,
                     "lga"=df$LGA
                     )
sports[,c(1,4,5,6,7,8,10,11)] <- sapply(sports[,c(1,4,5,6,7,8,10,11)],as.character)

# subset
sports <- sports[which(sports[, "lga"] %in% lga), ]

# renaming
sports[sports$sport=="Australian Rules Football", "sport"] <- "Football"
sports[sports$sport=="Tennis (Outdoor)", "sport"] <- "Tennis"
sports[sports$sport=="Tennis (Indoor)", "sport"] <- "Tennis"
sports[sports$sport=="Tennis (indoor)", "sport"] <- "Tennis"
sports[sports$sport=="Netball (Indoor)", "sport"] <- "Netball"
sports[sports$sport=="Netball (indoor)", "sport"] <- "Netball"
sports[sports$sport=="Netball (Outdoor)", "sport"] <- "Netball"
sports[sports$sport=="Soccer (Indoor Soccer / Futsal)", "sport"] <- "Futsal"
sports[sports$sport=="AFL (Indoor)", "sport"] <- "Football"
sports[sports$sport=="Cricket (Indoor)", "sport"] <- "Cricket"
sports[sports$sport=="Rock Climbing / Abseiling (Indoor)", "sport"] <- "Rock Climbing"
sports[sports$sport=="Roller Sports - Other", "sport"] <- "Roller Sports"
sports[sports$sport=="Open Space", "sport"] <- "Playground"

# drop NA
sports <- sports[sports$sport!="", ]
sports <- na.omit(sports)

# merge street_no, street_name, street_type, suburb, postcode to get address column
for (i in 1:nrow(sports)){
  if (is.na(sports$street_no[i])){
    address <- paste(sports$street_name[i], " ", sports$street_type[i], ",", " ", sports$suburb[i], " ", 
                     sports$postcode[i], sep="")
  }
  else {
    address <- paste(sports$street_no[i], " ", sports$street_name[i], " ", sports$street_type[i], ",", 
                     " ", sports$suburb[i], " ", sports$postcode[i], sep="")
  }
  
  sports$address[i] <- address
}

# write out csv
write.csv(sports, file="sports_subset.csv", row.names = FALSE)



