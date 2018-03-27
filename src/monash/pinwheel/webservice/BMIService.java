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

@Path("/bmiservice")
public class BMIService {

	// This method is called if TEXT_PLAIN is request
	@GET
	@Path("/bmis/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getKids(@PathParam("id") int kidId) throws SQLException, NamingException {
		return new Gson().toJson(BMIDbUtil.getInstance().getKidBMIs(kidId));
	}

	@GET
	@Path("/check/{month}/{weight}/{height}/{gender}")
	@Produces(MediaType.APPLICATION_JSON)
	public String checkKid(@PathParam("month") float month, @PathParam("weight") float weight,
			@PathParam("height") float height, @PathParam("gender") int gender) throws SQLException, NamingException {
		return new Gson().toJson(BMIDbUtil.getInstance().checkBMI(month, weight, height, gender));
	}

	@GET
	@Path("/bmis/delete/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteBMI(@PathParam("id") int bmiId) throws SQLException, NamingException {
		return new Gson().toJson(BMIDbUtil.getInstance().deleteBMIRecordById(bmiId));
	}
	
}
