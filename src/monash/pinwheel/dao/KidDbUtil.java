package monash.pinwheel.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
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

import monash.pinwheel.entity.Kid;

public class KidDbUtil {
	private static KidDbUtil instance;
	private DataSource dataSource;
	private String jndiName = "java:comp/env/jdbc/child_obesity";

	public static KidDbUtil getInstance() throws NamingException {
		if (instance == null) {
			instance = new KidDbUtil();
		}

		return instance;
	}

	private KidDbUtil() throws NamingException {
		dataSource = getDataSource();
	}

	private DataSource getDataSource() throws NamingException {
		Context context = new InitialContext();

		DataSource dataSource = (DataSource) context.lookup(jndiName);

		return dataSource;
	}

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
				return new Kid(result.getInt("id"), result.getString("name"), result.getInt("gender"), result.getDate("dob"));
			}
		} finally {
			close(conn, myStmt, result);
		}
		return null;
	}

	public void addKid(Kid newKid) throws SQLException {
		Connection myConn = null;
		PreparedStatement myStmt = null;

		try {
			myConn = getConnection();

			String sql = "insert into kid (name, dob, gender, parent_id) values (?, ?, ?, ?)";

			myStmt = myConn.prepareStatement(sql);

			// set params
			myStmt.setString(1, newKid.getName());
			DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
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

			myStmt.execute();
		} finally {
			close(myConn, myStmt, null);
		}
	}

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

	private Connection getConnection() throws SQLException {
		// TODO Auto-generated method stub
		Connection theConn = dataSource.getConnection();

		return theConn;
	}

}
