package monash.pinwheel.managedbean;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import javax.naming.NamingException;

import monash.pinwheel.dao.BMIDbUtil;
import monash.pinwheel.dao.KidDbUtil;
import monash.pinwheel.entity.BMI;
import monash.pinwheel.entity.Kid;

// TODO: Auto-generated Javadoc
/**
 * The Class KidMangedBean.
 */
@ManagedBean
@SessionScoped
public class KidMangedBean {

	/** The kids. */
	private List<Kid> kids;
	
	/** The kid db util. */
	private KidDbUtil kidDbUtil;
	
	/** The logger. */
	private Logger logger = Logger.getLogger(getClass().getName());

	/**
	 * Instantiates a new kid manged bean.
	 *
	 * @throws NamingException the naming exception
	 */
	public KidMangedBean() throws NamingException {
		// TODO Auto-generated constructor stub
		kids = new ArrayList<>();

		kidDbUtil = KidDbUtil.getInstance();
	}

	/**
	 * Gets the kids.
	 *
	 * @return the kids
	 */
	public List<Kid> getKids() {
		return kids;
	}

	/**
	 * Load kids.
	 */
	public void loadKids() {

		logger.info("Loading students");

		kids.clear();

		try {

			// get all students from database
			kids = kidDbUtil.getKids();

		} catch (Exception exc) {
			// send this to server logs
			logger.log(Level.SEVERE, "Error loading students", exc);

			// add error message for JSF page
			addErrorMessage(exc);
		}
	}

	/**
	 * Adds the kid.
	 *
	 * @param newKid the new kid
	 * @return the string
	 */
	public String addKid(Kid newKid) {
		try {
			KidDbUtil.getInstance().addKid(newKid);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		String viewId = FacesContext.getCurrentInstance().getViewRoot().getViewId();
		return viewId + "?faces-redirect=true";
	}

	/**
	 * Save kid.
	 *
	 * @param newKid the new kid
	 * @return the string
	 */
	public String saveKid(Kid newKid) {
		try {
			KidDbUtil.getInstance().updateKid(newKid);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		String viewId = FacesContext.getCurrentInstance().getViewRoot().getViewId();
		return viewId + "?faces-redirect=true&id="+newKid.getId();
	}
	
	/**
	 * Delete kid.
	 *
	 * @param id the id
	 * @return the string
	 */
	public String deleteKid(int id) {
		try {
			// Delete all BMI records relate to the kid
			BMIDbUtil.getInstance().deleteBMIRecordByKidId(id);
			// Delete the did
			KidDbUtil.getInstance().deleteKid(id);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		String viewId = FacesContext.getCurrentInstance().getViewRoot().getViewId();
		return viewId + "?faces-redirect=true&";
	}
	
	/**
	 * Adds the error message.
	 *
	 * @param exc the exc
	 */
	private void addErrorMessage(Exception exc) {
		FacesMessage message = new FacesMessage("Error: " + exc.getMessage());
		FacesContext.getCurrentInstance().addMessage(null, message);
	}

}
