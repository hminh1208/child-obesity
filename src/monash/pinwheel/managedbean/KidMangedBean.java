package monash.pinwheel.managedbean;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import javax.naming.NamingException;

import monash.pinwheel.dao.KidDbUtil;
import monash.pinwheel.entity.Kid;

@ManagedBean
@SessionScoped
public class KidMangedBean {

	private List<Kid> kids;
	private KidDbUtil kidDbUtil;
	private Logger logger = Logger.getLogger(getClass().getName());

	public KidMangedBean() throws NamingException {
		// TODO Auto-generated constructor stub
		kids = new ArrayList<>();

		kidDbUtil = KidDbUtil.getInstance();
	}

	public List<Kid> getKids() {
		return kids;
	}

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
		return viewId + "?faces-redirect=true";
	}
	
	private void addErrorMessage(Exception exc) {
		FacesMessage message = new FacesMessage("Error: " + exc.getMessage());
		FacesContext.getCurrentInstance().addMessage(null, message);
	}

}
