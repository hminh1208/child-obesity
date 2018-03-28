package monash.pinwheel.webservice;

import java.io.Console;
import java.sql.SQLException;
import java.util.List;

import javax.naming.NamingException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.google.gson.Gson;
import com.sun.faces.config.DbfFactory;

import monash.pinwheel.dao.BMIDbUtil;
import monash.pinwheel.dao.KidDbUtil;
import monash.pinwheel.entity.Kid;

// TODO: Auto-generated Javadoc
/**
 * The Class KidService.
 */
@Path("/kidservice")

public class KidService {

	/**
	 * Gets the all kids in the database.
	 *
	 * @return the list of kids
	 * @throws SQLException the SQL exception
	 * @throws NamingException the naming exception
	 */
	// This method is called if TEXT_PLAIN is request
	@GET
	@Path("/kids")
	@Produces(MediaType.APPLICATION_JSON)
	public String getKids() throws SQLException, NamingException {
		return new Gson().toJson(KidDbUtil.getInstance().getKids());
	}

	/**
	 * Gets the kid by id.
	 *
	 * @param id the id
	 * @return the kid by id
	 * @throws SQLException the SQL exception
	 * @throws NamingException the naming exception
	 */
	@GET
	@Path("/kid/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getKidById(@PathParam("id") int id) throws SQLException, NamingException {
		return new Gson().toJson(KidDbUtil.getInstance().getKidById(id));
	}

	/**
	 * Delete kid by id.
	 *
	 * @param id the id
	 * @throws SQLException the SQL exception
	 * @throws NamingException the naming exception
	 */
	@GET
	@Path("/delete/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public void deleteKidById(@PathParam("id") int id) throws SQLException, NamingException {
		BMIDbUtil.getInstance().deleteBMIRecordByKidId(id);
		KidDbUtil.getInstance().deleteKid(id);
	}
	
}
