import java.net.URLDecoder;

import netscape.javascript.JSObject;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javafx.scene.web.WebView;

// https://github.com/appnexus/mobile-sdk-android/blob/master/sdk/src/com/appnexus/opensdk/AdWebView.java

public class AdWebView {
	static final String PREAMBLE = "javascript: ";
	public int debug = 4;
	public int info = 3;
	public int warn = 2;
	public int error = 1;
	WebView browser = new WebView();

	public AdWebView() {

	}

	public void log(Object str) {
		String[] lines = str.toString().split("\n");
		for (String line : lines) {
			System.out.println(PREAMBLE + line);
		}
	}

	// close button: http://creative.adform.com/support/adquestions/close-button-in-mobile-app/
	public void expand(Object obj) {
		String str = URLDecoder.decode(obj.toString());
		String lines[] = str.split("&");
		int w = 320;
		int h = 50;
		boolean customClose = false;
		for (String line : lines) {
			String tuple[] = line.split("=");
			if (tuple[0].equals("customClose")) {
				System.out.println("CUSTOM CLOSE = " + tuple[1]);
				customClose = Boolean.parseBoolean(tuple[1]);
			}
			if (tuple[0].equals("w")) {
				System.out.println("WIDTH = " + tuple[1]);
				w = Integer.parseInt(tuple[1]);
			}
			if (tuple[0].equals("h")) {
				System.out.println("HEIGHT = " + tuple[1]);
				h = Integer.parseInt(tuple[1]);
			}
		}
		System.out.println("######### expand " + str);
	
		if (customClose) 
			return;
		
		/**
		 * Ok, in the expanded state, we have to provide the close button
		 */
		Document doc = this.browser.getEngine().getDocument();
		Element el = doc.getElementById("expanded");

		printElement(el,0);

	}
	
	void printElement(Element el, int level) {
		 NodeList childNodes = el.getChildNodes();
		    for(int j=0; j<level; j++) System.out.print("-");
		    System.out.print("tag: "+el.getNodeName());
		    NamedNodeMap map = el.getAttributes();
		    for (int x = 0; x < map.getLength(); x++) {
		    	Node n = map.item(x);
		    	System.out.print(" " + n.getNodeName() + ":" + n.getNodeValue());
		    }

		    if(el.getNodeName().equals("A")){
		        System.out.print(", content: "+el.getTextContent());
		    } 
		    System.out.println("");
		    for(int i=0; i<childNodes.getLength(); i++){
		        Node item = childNodes.item(i);
		        if(item instanceof Element){
		            printElement((Element)item, level++);
		        }
		    }
	}

	public void open(Object obj) {
		System.out.println("######### w=open!");
	}

	public void close() {
		System.out.println("######### w=close");
	}

	public void setOrientationProperties(Object obj) {
		System.out.println("######### w=setOrientationProperties!");
	}

	public void setExpandProperties(Object obj) {
		System.out.println("######### w=setExpandProperties!");
	}

	public void setResizeProperties(Object obj) {
		System.out.println("######### w=setResizeProperties!");
	}

	public void resize() {
		System.out.println("######### w=resize!");
	}

	public Object getCurrentPosition(Object obj) {
		System.out.println("######### w=getCurrentPosition!");
		return null;
	}

	public Object getOrientation() {
		System.out.println("######### w=getOrientation!");
		return null;
	}

	public void storedPicture(Object obj) {
		System.out.println("######### w=storedPicture!");
	}

	public void createCalendarEntry(Object obj) {
		System.out.println("######### w=createCalendarEntry!");
	}

	public void playVideo(Object obj) {
		System.out.println("######### w=playVideo!");
	}
}