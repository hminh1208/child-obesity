# libs
library(readr)
library(dplyr)


# LGAs
lga <- c("Melbourne", "Port Phillip", "Stonnington", "Yarra", "Banyule", "Bayside", "Boroondara", "Brimbank", "Darebin",
         "Glen Eira", "Hobsons Bay", "Kingston", "Manningham", "Maribyrnong", "Monash", "Moonee Valley", "Moreland",
         "Whitehorse", "Cardinia", "Casey", "Frankston", "Greater Dandenong", "Hume", "Knox", "Maroondah", "Melton",
         "Mornington Peninsula", "Nillumbik", "Whittlesea", "Wyndham", "Yarra Ranges")
lga <- toupper(lga)

# read in csv
df <- read_csv("sport_rec_facilities.csv")
 
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
                     "num_fields"=df$NumberFieldCourts,
                     "field_surface"=df$FieldSurfaceType,
                     "lga"=df$LGA
                     )
sports[,c(1,4,5,6,7,8,10,12,13)] <- sapply(sports[,c(1,4,5,6,7,8,10,12,13)],as.character)

# subset
sports <- sports[which(sports[, "lga"] %in% lga), ]

# write out csv
write.csv(sports, file="sports_subset.csv", row.names = FALSE)

# do manual cleaning in excel
sports <- read.csv("sports_subset2.csv", header=TRUE, stringsAsFactors = FALSE)

# merge street_no, street_name, street_type, suburb, postcode to get address column
for (i in 1:nrow(sports)){
  if (is.na(sports$street_no[i])){
    address <- paste(sports$street_name[i], sports$street_type[i], ",", sports$suburb[i], sports$postcode[i])
  }
  else {
    address <- paste(sports$street_no[i], sports$street_name[i], sports$street_type[i], ",", 
                     sports$suburb[i], sports$postcode[i])
  }
  
  sports$address[i] <- address
}

# write out csv
write.csv(sports, file="sports_cleaned2.csv", row.names = FALSE)




