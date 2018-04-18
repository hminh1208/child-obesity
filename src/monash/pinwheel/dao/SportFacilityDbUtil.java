package monash.pinwheel.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.taglibs.standard.tag.common.sql.SetDataSourceTagSupport;

import monash.pinwheel.entity.Kid;
import monash.pinwheel.entity.SportFacility;
import monash.pinwheel.entity.Suburb;

public class SportFacilityDbUtil {
	
	/** The singleton instance. */
	private static SportFacilityDbUtil instance;
	
	/** The data source. */
	private DataSource dataSource;
	
	/** The jndi name. */
	private String jndiName = "java:comp/env/jdbc/sport_fac";

	/**
	 * Gets the single instance of KidDbUtil.
	 *
	 * @return single instance of KidDbUtil
	 * @throws NamingException the naming exception
	 */
	public static SportFacilityDbUtil getInstance() throws NamingException {
		if (instance == null) {
			instance = new SportFacilityDbUtil();
		}

		return instance;
	}

	/**
	 * Instantiates a new kid db util.
	 *
	 * @throws NamingException the naming exception
	 */
	private SportFacilityDbUtil() throws NamingException {
		dataSource = getDataSource();
	}

	/**
	 * Gets the data source.
	 *
	 * @return the data source
	 * @throws NamingException the naming exception
	 */
	private DataSource getDataSource() throws NamingException {
		Context context = new InitialContext();

		DataSource dataSource = (DataSource) context.lookup(jndiName);

		return dataSource;
	}
	
	/**
	 * Close connection to database.
	 *
	 * @param conn the connection to database
	 * @param st the statement
	 * @param re the resultset
	 */
	private void close(Connection conn, Statement st, ResultSet re) {
		// TODO Auto-generated method stub
		try {
			if (re != null) {
				re.close();
			}

			if (st != null) {
				st.close();
			}

			if (conn != null) {
				conn.close();
			}

		} catch (Exception exc) {
			exc.printStackTrace();
		}
	}

	/**
	 * Gets the connection to database.
	 *
	 * @return the connection to database
	 * @throws SQLException the SQL exception
	 */
	private Connection getConnection() throws SQLException {
		// TODO Auto-generated method stub
		Connection theConn = dataSource.getConnection();

		return theConn;
	}
	
	public List<String> getAllSports() throws SQLException{
		List<String> sports = new ArrayList<>();

		Connection conn = null;
		Statement statement = null;
		ResultSet result = null;

		try {
			conn = getConnection();
			String sql = "select distinct sport from sports_rec";
			statement = conn.createStatement();
			result = statement.executeQuery(sql);

			while (result.next()) {
				String name = result.getString("sport");
				sports.add(name);
			}
		} finally {
			close(conn, statement, result);
		}

		return sports;
	}
	
	public List<String> getAllSportsBySuburbOrPostCode(String suburb, int postCode) throws SQLException{
		List<String> sports = new ArrayList<>();

		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet result = null;

		try {
			conn = getConnection();
			String sql = "SELECT DISTINCT sport FROM sports_rec WHERE suburb LIKE ? AND postcode = ?";
			statement = conn.prepareStatement(sql);
			statement.setString(1, suburb);
			statement.setInt(2, postCode);
			
			result = statement.executeQuery();

			while (result.next()) {
				String name = result.getString("sport");
				sports.add(name);
			}
		} finally {
			close(conn, statement, result);
		}

		return sports;
	}
	
	public List<SportFacility> getAllSportsDetailBySuburbOrPostCode(String suburb, int postCode, float lat, float lon) throws SQLException{
		List<SportFacility> sports = new ArrayList<>();

		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet result = null;

		try {
			conn = getConnection();
			String sql = "SELECT * FROM sports_rec WHERE suburb LIKE ? AND postcode = ?";
			statement = conn.prepareStatement(sql);
			statement.setString(1, suburb);
			statement.setInt(2, postCode);
			
			result = statement.executeQuery();

			while (result.next()) {
				
				String id = result.getString("id");
				
				// the facility already in the list, we only need to add sport and type to the facility detail
				int index = checkExistSportFacilityInList(sports, id);
				if (index != -1) {
					String sport = result.getString("sport");
					String type = result.getString("type");
					sports.get(index).concatSportType(sport, type);
				}else {
					SportFacility newFacility = new SportFacility();
					newFacility.setId(id);
					newFacility.setLatitude(result.getFloat("lat"));
					newFacility.setLongitude(result.getFloat("lon"));
					newFacility.setName(result.getString("name"));
					newFacility.setStreet_no(result.getInt("street_no"));
					newFacility.setStreet_name(result.getString("street_name"));
					newFacility.setStreet_type(result.getString("street_type"));
					newFacility.setSuburb(result.getString("suburb"));
					newFacility.setPostCode(result.getInt("postCode"));
					String sport = result.getString("sport");
					String type = result.getString("type");
					newFacility.concatSportType(sport, type);
					newFacility.setLga(result.getString("lga"));
					newFacility.setAddress(result.getString("address"));
					if(lat != 0 && lon != 0) {
						newFacility.setDistanceFromPoint(lat, lon);
					}
					sports.add(newFacility);
				}
			}
		} finally {
			close(conn, statement, result);
		}

		return sports;
	}
	
	public List<Suburb> getAllSuburb() throws SQLException{
		List<Suburb> suburbs = new ArrayList<>();

		Connection conn = null;
		Statement statement = null;
		ResultSet result = null;

		try {
			conn = getConnection();
		String sql = "SELECT DISTINCT suburb, postCode FROM sports_rec ORDER BY suburb";
			statement = conn.createStatement();
			result = statement.executeQuery(sql);

			while (result.next()) {
				suburbs.add(new Suburb(result.getString("suburb"), result.getInt("postCode")));
			}
		} finally {
			close(conn, statement, result);
		}

		return suburbs;
	}
	
	private int checkExistSportFacilityInList(List<SportFacility> list, String id) {
	
		for (int i = 0; i < list.size(); i++) {
			if (list.get(i).getId().equals(id)) {
				return i;
			}
		}
		
		return -1;
	}
}
