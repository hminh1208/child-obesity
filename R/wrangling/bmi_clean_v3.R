# load libraries
library(reshape2)

bmi_clean <- function(filename){
  df <- read.csv(filename, header=TRUE)
  colnames(df) <- c("sex", "age_months", "L", "M", "S","3_percentile", "5_percentile", 
                    "10_percentile", "25_percentile", "50_percentile", 
                    "75_percentile", "85_percentile", "90_percentile", "95_percentile", "97_percentile")
  
  df <- melt(df, id=c("sex","age_months", "L", "M", "S"))
  
  df$group <- rep("a", nrow(df))
  
  df[df$variable=="3_percentile", "group"] <- "underweight"
  df[df$variable=="5_percentile", "group"] <- "normal"
  df[df$variable=="10_percentile", "group"] <- "normal"
  df[df$variable=="25_percentile", "group"] <- "normal"
  df[df$variable=="50_percentile", "group"] <- "normal"
  df[df$variable=="75_percentile", "group"] <- "normal"
  df[df$variable=="85_percentile", "group"] <- "overweight"
  df[df$variable=="90_percentile", "group"] <- "overweight"
  df[df$variable=="95_percentile", "group"] <- "obese"
  df[df$variable=="97_percentile", "group"] <- "obese"
  
  df$group <- factor(df$group, levels=c("obese", "overweight", "normal", "underweight"))
  # 1: male, 2:female
  boy <- df[df$sex==1, -c(1)]
  girl <- df[df$sex==2, -c(1)]
  
  write.csv(boy, file="cleaned_boy_bmi_v2.csv", row.names = FALSE)
  write.csv(girl, file="cleaned_girl_bmi_v2.csv", row.names = FALSE)
}

bmi_clean("bmi_with_lms.csv")
