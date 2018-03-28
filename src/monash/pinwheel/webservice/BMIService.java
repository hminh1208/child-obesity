package monash.pinwheel.webservice;

import java.sql.SQLException;

import javax.naming.NamingException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.google.gson.Gson;

import monash.pinwheel.dao.BMIDbUtil;

// TODO: Auto-generated Javadoc
/**
 * The Class BMIService is Webservice class.
 */
@Path("/bmiservice")
public class BMIService {

	/**
	 * Gets the kids.
	 *
	 * @param kidId the kid id
	 * @return the list of kids in JSON format
	 * @throws SQLException the SQL exception
	 * @throws NamingException the naming exception
	 */
	// This method is called if TEXT_PLAIN is request
	@GET
	@Path("/bmis/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getKids(@PathParam("id") int kidId) throws SQLException, NamingException {
		return new Gson().toJson(BMIDbUtil.getInstance().getKidBMIs(kidId));
	}

	/**
	 * Check kid's BMI based on date of birth, weight, height and gender
	 *
	 * @param month the month
	 * @param weight the weight
	 * @param height the height
	 * @param gender the gender
	 * @return the string
	 * @throws SQLException the SQL exception
	 * @throws NamingException the naming exception
	 */
	@GET
	@Path("/check/{month}/{weight}/{height}/{gender}")
	@Produces(MediaType.APPLICATION_JSON)
	public String checkKid(@PathParam("month") float month, @PathParam("weight") float weight,
			@PathParam("height") float height, @PathParam("gender") int gender) throws SQLException, NamingException {
		return new Gson().toJson(BMIDbUtil.getInstance().checkBMI(month, weight, height, gender));
	}

	/**
	 * Delete BMI records.
	 *
	 * @param bmiId the bmi id
	 * @return the string
	 * @throws SQLException the SQL exception
	 * @throws NamingException the naming exception
	 */
	@GET
	@Path("/bmis/delete/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteBMI(@PathParam("id") int bmiId) throws SQLException, NamingException {
		return new Gson().toJson(BMIDbUtil.getInstance().deleteBMIRecordById(bmiId));
	}
	
}
