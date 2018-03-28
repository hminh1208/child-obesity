package monash.pinwheel.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;

import monash.pinwheel.entity.BMI;
import monash.pinwheel.entity.Kid;

// TODO: Auto-generated Javadoc
/**
 * The Class KidDbUtil will contains all functions relate to Kid Entity in Database. This class designed based on Singleton design pattern
 */
public class KidDbUtil {
	
	/** The singleton instance. */
	private static KidDbUtil instance;
	
	/** The data source. */
	private DataSource dataSource;
	
	/** The jndi name. */
	private String jndiName = "java:comp/env/jdbc/child_obesity";

	/**
	 * Gets the single instance of KidDbUtil.
	 *
	 * @return single instance of KidDbUtil
	 * @throws NamingException the naming exception
	 */
	public static KidDbUtil getInstance() throws NamingException {
		if (instance == null) {
			instance = new KidDbUtil();
		}

		return instance;
	}

	/**
	 * Instantiates a new kid db util.
	 *
	 * @throws NamingException the naming exception
	 */
	private KidDbUtil() throws NamingException {
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
	 * Gets all the kids in database.
	 *
	 * @return the list of kids
	 * @throws SQLException the SQL exception
	 */
	public List<Kid> getKids() throws SQLException {
		List<Kid> kids = new ArrayList<>();

		Connection conn = null;
		Statement statement = null;
		ResultSet result = null;

		try {
			conn = getConnection();
			String sql = "select * from kid";
			statement = conn.createStatement();
			result = statement.executeQuery(sql);

			while (result.next()) {
				int id = result.getInt("id");
				String name = result.getString("name");
				kids.add(new Kid(id, name, 0, 0));
			}
		} finally {
			close(conn, statement, result);
		}

		return kids;
	}

	/**
	 * Gets the kid information by kid id.
	 *
	 * @param id the kid id
	 * @return the kid information
	 * @throws SQLException the SQL exception
	 */
	public Kid getKidById(int id) throws SQLException {

		Connection conn = null;
		PreparedStatement myStmt = null;
		ResultSet result = null;

		try {
			conn = getConnection();
			String sql = "select * from kid where id = ?";
			myStmt = conn.prepareStatement(sql);
			myStmt.setInt(1, id);

			result = myStmt.executeQuery();

			if (result.next()) {
				return new Kid(result.getInt("id"), result.getString("name"), result.getInt("gender"),
						result.getDate("dob"));
			}
		} finally {
			close(conn, myStmt, result);
		}
		return null;
	}

	/**
	 * Adds the kid.
	 *
	 * @param newKid the new kid instance
	 * @throws SQLException the SQL exception
	 * @throws NamingException the naming exception
	 */
	public void addKid(Kid newKid) throws SQLException, NamingException {
		Connection myConn = null;
		PreparedStatement myStmt = null;

		try {
			myConn = getConnection();

			// insert record to kid table
			String sql = "insert into kid (name, dob, gender, parent_id) values (?, ?, ?, ?)";

			myStmt = myConn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

			// set params
			myStmt.setString(1, newKid.getName());
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			Date startDate = null;
			try {
				startDate = new Date(df.parse(newKid.getDob()).getTime());
				myStmt.setDate(2, startDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			myStmt.setInt(3, newKid.getGender());
			// default parent id for testing
			myStmt.setInt(4, 1);

			myStmt.executeUpdate();
			ResultSet rs = myStmt.getGeneratedKeys();
			if (rs.next()) {
			    int kidID = rs.getInt(1);
			    BMIDbUtil.getInstance().addBMI(new BMI(kidID, newKid.getWeight(), newKid.getHeight(),
						new java.sql.Date(Calendar.getInstance().getTime().getTime())));
			}
			myConn.commit();
			// insert record to bmirecord table
			
		} finally {
			close(myConn, myStmt, null);
		}
	}

	/**
	 * Update kid.
	 *
	 * @param newKid the update kid instance
	 * @throws SQLException the SQL exception
	 */
	public void updateKid(Kid newKid) throws SQLException {
		Connection conn = null;
		PreparedStatement myStmt = null;

		try {
			conn = getConnection();

			String sql = "update kid set name = ?, dob = ?, gender = ? where id = ?";
			myStmt = conn.prepareStatement(sql);

			// set params
			myStmt.setString(1, newKid.getName());

			DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			Date startDate = null;
			try {
				startDate = new Date(df.parse(newKid.getDob()).getTime());
				myStmt.setDate(2, startDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

			myStmt.setInt(3, newKid.getGender());

			myStmt.setInt(4, newKid.getId());
			// default parent id for testing
			System.out.println("Testing " + newKid.getId() + " " + newKid.getName());
			myStmt.execute();
			conn.commit();
		} finally {
			close(conn, myStmt, null);
		}
	}

	/**
	 * Delete kid by kid id.
	 *
	 * @param id the kid id to be deleted
	 * @throws SQLException the SQL exception
	 */
	public void deleteKid(int id) throws SQLException {
		Connection conn = null;
		PreparedStatement myStmt = null;

		try {
			conn = getConnection();

			String sql = "Delete From kid where id = ?";
			myStmt = conn.prepareStatement(sql);

			// set params
			myStmt.setInt(1, id);
			myStmt.execute();
			conn.commit();
		} finally {
			close(conn, myStmt, null);
		}
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

}
