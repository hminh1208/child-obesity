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
import monash.pinwheel.dao.SportFacilityDbUtil;

// TODO: Auto-generated Javadoc
/**
 * The Class BMIService is Webservice class.
 */
@Path("/facility")
public class SportFacilityService {

	/**
	 * Gets the sport list.
	 *
	 * @return the list of kids in JSON format
	 * @throws SQLException the SQL exception
	 * @throws NamingException the naming exception
	 */
	// This method is called if TEXT_PLAIN is request
	@GET
	@Path("/all/sport_type/{postcode}/{name}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getSportList(@PathParam("postcode") int postCode, @PathParam("name") String suburbName) throws SQLException, NamingException {
		return new Gson().toJson(SportFacilityDbUtil.getInstance().getAllSportsBySuburbOrPostCode(suburbName, postCode));
	}
	
	@GET
	@Path("/all/sport_facilities/{postcode}/{name}/{lat}/{lon}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getSportListDetail(@PathParam("postcode") int postCode, @PathParam("name") String suburbName, @PathParam("lat") float latitude, @PathParam("lon") float longitude) throws SQLException, NamingException {
		return new Gson().toJson(SportFacilityDbUtil.getInstance().getAllSportsDetailBySuburbOrPostCode(suburbName, postCode, latitude, longitude));
	}
	
	@GET
	@Path("/all/suburb")
	@Produces(MediaType.APPLICATION_JSON)
	public String getAllSuburb() throws SQLException, NamingException {
		return new Gson().toJson(SportFacilityDbUtil.getInstance().getAllSuburb());
	}
	
}
