library(readxl)
library(dplyr)

# overweight
ow <- read_xlsx("prop_children_overweight.xlsx", sheet="6.1", range="B2:C16", col_names=FALSE)
colnames(ow) <- c("sub_cat", "overweight")

ow <- data.frame(lapply(ow, function(x) {gsub("Victoria -  ", "", x)}))
ow <- ow[1:8,]
ow$sub_cat <- as.character(ow$sub_cat)
ow$overweight <- as.numeric(as.character(ow$overweight))

# underweight
uw <- read_xlsx("prop_children_underweight.xlsx", sheet="6.2", range="B2:C16", col_names=FALSE)
colnames(uw) <- c("sub_cat", "underweight")

uw <- data.frame(lapply(uw, function(x) {gsub("Victoria -  ", "", x)}))
uw <- uw[1:8,]
uw$sub_cat <- as.character(uw$sub_cat)
uw$underweight <- as.numeric(as.character(uw$underweight))

# physical activity
pa <- read_xlsx("prop_children_pa.xlsx", sheet="9.1b", range="B2:C33", col_names=FALSE)
colnames(pa) <- c("sub_cat", "physical_activity")

pa <- data.frame(lapply(pa, function(x) {gsub("Victoria -  ", "", x)}))
pa <- data.frame(lapply(pa, function(x) {gsub(" Area", "", x)}))
pa <- pa[c(1:8, 16:32),]
pa$sub_cat <- as.character(pa$sub_cat)
pa$physical_activity <- as.numeric(as.character(pa$physical_activity))

# combined
com <- full_join(uw, ow, by="sub_cat")
combined <- full_join(com, pa, by="sub_cat")

# add category
age <- c("Year 5","Year 8","Year 11")
area <- c("Victoria","Metropolitan","Regional")
gender <- c("Female","Male")
metro <- c("Bayside Pensinsula","Brimbank Melton","Hume Moreland","Inner Eastern Melbourne",
           "North Eastern Melbourne","Outer Eastern Melbourne","Southern Melbourne","Western Melbourne")
regional <- c("Barwon","Central Highlands","Goulburn","Inner Gippland","Loddon","Mallee","Outer Gippsland",
              "Ovens Murray","Western District")

combined$category <- ""

for (i in 1:nrow(combined)){
  if(combined$sub_cat[i] %in% age) combined$category[i] <- "age"
  if(combined$sub_cat[i] %in% area) combined$category[i] <- "area"
  if(combined$sub_cat[i] %in% gender) combined$category[i] <- "gender"
  if(combined$sub_cat[i] %in% metro) combined$category[i] <- "metropolitan"
  if(combined$sub_cat[i] %in% regional) combined$category[i] <- "regional"
}

combined <- combined[, c("category", "sub_cat", "physical_activity", "overweight", "underweight")]

write.csv(combined, "vcams_combined.csv", row.names=FALSE)



