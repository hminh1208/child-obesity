package monash.pinwheel.dao;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLWarning;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import monash.pinwheel.entity.BMI;
import monash.pinwheel.entity.Kid;

public class BMIDbUtil {
	private static BMIDbUtil instance;
	private DataSource dataSource;
	private String jndiName = "java:comp/env/jdbc/child_obesity";

	public static BMIDbUtil getInstance() throws NamingException {
		if (instance == null) {
			instance = new BMIDbUtil();
		}

		return instance;
	}

	private BMIDbUtil() throws NamingException {
		dataSource = getDataSource();
	}

	private DataSource getDataSource() throws NamingException {
		Context context = new InitialContext();

		DataSource dataSource = (DataSource) context.lookup(jndiName);

		return dataSource;
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

	public List<BMI> getKidBMIs(int kidId) throws SQLException {
		List<BMI> bmiRecords = new ArrayList<>();

		Connection conn = null;
		PreparedStatement myStmt = null;
		ResultSet result = null;

		try {
			conn = getConnection();
			String sql = "select * from bmirecord where kid_id = ?";
			myStmt = conn.prepareStatement(sql);
			myStmt.setInt(1, kidId);
			result = myStmt.executeQuery();

			while (result.next()) {
				bmiRecords.add(new BMI(result.getInt("id"), result.getInt("kid_id"), result.getFloat("weight"),
						result.getFloat("height"), result.getDate("input_date")));
			}
		} finally {
			close(conn, myStmt, result);
		}

		return bmiRecords;
	}

	public boolean addBMI(BMI record) throws SQLException {

		Connection conn = null;
		PreparedStatement myStmt = null;

		if (checkExistRecord(record.getInputDate())) {
			return updateBMIRecord(record);
		}
		
		try {
			conn = getConnection();
			String sql = "Insert Into bmirecord(kid_id, weight, height, input_date) values(?, ?, ?, ?)";
			System.out.println("Mina"+sql);
			myStmt = conn.prepareStatement(sql);
			myStmt.setInt(1, record.getKidId());
			myStmt.setFloat(2, record.getWeight());
			myStmt.setFloat(3, record.getHeight());

			DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
			Date inputDate = null;
			try {
				inputDate = new Date(df.parse(record.getInputDate()).getTime());
				myStmt.setDate(4, inputDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			myStmt.execute();
			conn.commit();
			return true;
		} finally {
			close(conn, myStmt, null);
		}
	}

	public boolean checkExistRecord(String checkDate) throws SQLException {
		Connection conn = null;
		PreparedStatement myStmt = null;
		ResultSet result = null;

		try {
			conn = getConnection();
			String sql = "Select * from bmirecord where input_date = ?";
			myStmt = conn.prepareStatement(sql);

			DateFormat df = new SimpleDateFormat("dd-MM-yyyy");
			Date inputDate = null;
			try {
				inputDate = new Date(df.parse(checkDate).getTime());
				myStmt.setDate(1, inputDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

			if (myStmt.executeQuery().next()) {
				return true;
			} else {
				return false;
			}
		} finally {
			close(conn, myStmt, result);
		}
	}
	
	public boolean updateBMIRecord(BMI record) throws SQLException {
		Connection conn = null;
		PreparedStatement myStmt = null;
		ResultSet result = null;

		try {
			conn = getConnection();
			String sql = "Update bmirecord set weight = ?, height = ? where input_date = ? AND kid_id = ?";
			myStmt = conn.prepareStatement(sql);

			DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
			Date inputDate = null;
			try {
				myStmt.setFloat(1, record.getWeight());
				myStmt.setFloat(2, record.getHeight());
				inputDate = new Date(df.parse(record.getInputDate()).getTime());
				myStmt.setDate(3, inputDate);
				myStmt.setInt(4, record.getKidId());
			} catch (ParseException e) {
				e.printStackTrace();
			}

			myStmt.executeQuery();
			conn.commit();
			return true;
		} finally {
			close(conn, myStmt, result);
		}
	}
	
	public boolean deleteBMIRecordByKidId(int kidId) throws SQLException {
		Connection conn = null;
		PreparedStatement myStmt = null;

		try {
			conn = getConnection();
			String sql = "Delete From bmirecord Where kid_id = ?";
			myStmt = conn.prepareStatement(sql);
			myStmt.setInt(1, kidId);

			myStmt.execute();
			conn.commit();
			return true;
		} finally {
			close(conn, myStmt, null);
		}
	}
	
	public boolean deleteBMIRecordByKidIdAndDate(int kidId, String date) throws SQLException {
		Connection conn = null;
		PreparedStatement myStmt = null;

		try {
			conn = getConnection();
			String sql = "Delete From bmirecord Where kid_id = ? and input_date = ?";
			myStmt = conn.prepareStatement(sql);
			myStmt.setInt(1, kidId);
			
			DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
			Date inputDate = null;
			try {
				inputDate = new Date(df.parse(date).getTime());
				myStmt.setDate(2, inputDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

			myStmt.execute();
			conn.commit();
			return true;
		} finally {
			close(conn, myStmt, null);
		}
	}
}
