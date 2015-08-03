import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;

import netscape.javascript.JSObject;
import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker;
import javafx.concurrent.Worker.State;
import javafx.event.EventHandler;
import javafx.geometry.HPos;
import javafx.geometry.VPos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebEvent;
import javafx.scene.web.WebView;
import javafx.stage.Modality;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
 
// http://java-buddy.blogspot.com/2012/03/execute-javascript-in-webview-from-java.html
 
public class WebViewSample extends Application {
    private Scene scene;
    @Override public void start(Stage stage) {
        // create the scene
        stage.setTitle("Web View");
        scene = new Scene(new Browser(),350.0,500.0, Color.web("#666970"));
        stage.setScene(scene);       
        
        stage.show();
    }
 
    public static void main(String[] args){
        launch(args);
    }
}

class Browser extends Region {
 
    AdWebView ad = new AdWebView();
    final WebEngine webEngine = ad.browser.getEngine();
    boolean first = false;
     
    public Browser() {
    	
    	/**
    	 * Let's provide a AdWebView object mraid will need
    	 */
        JSObject jsobj = (JSObject) webEngine.executeScript("window");
        jsobj.setMember("AdWebView", ad);

        
        //apply the styles
        getStyleClass().add("browser");
        
        // load the web page
        //webEngine.load("http://www.oracle.com/products/index.html");
        
        File f = new File("test.html");
        if (f == null || f.exists()==false) {
        	System.err.println("Sorry, url is null");
        	return;
        }
        try {
			webEngine.load(f.toURI().toURL().toString());
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
        /**
         * Now let's provide an alert handler 
         */
        ad.browser.getEngine().setOnAlert(new EventHandler<WebEvent<String>>() {
            @Override public void handle(WebEvent<String> event) {
              Stage popup = new Stage();
              popup.setTitle("Alert!");
              popup.initStyle(StageStyle.UTILITY);
              popup.initModality(Modality.WINDOW_MODAL);
              
              StackPane content = new StackPane();
              content.getChildren().setAll(
                new Label(event.getData())
              );
              content.setPrefSize(500, 200); 
              
              popup.setScene(new Scene(content));
              popup.showAndWait();
            }
          });


        //add the web view to the scene
        getChildren().add(ad.browser);
 
    }
    private Node createSpacer() {
        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        return spacer;
    }
 
    @Override protected void layoutChildren() {
        double w = getWidth();
        double h = getHeight();
        layoutInArea(ad.browser,0,0,w,h,0, HPos.CENTER, VPos.CENTER);
    }
 
    @Override protected double computePrefWidth(double height) {
        return 750;
    }
 
    @Override protected double computePrefHeight(double width) {
        return 500;
    }
}