# PlanWander

- A travel planning platform that enables users to seamlessly plan and share itineraries. Users can organize trips using maps without switching between tools. The platform also allows for viewing travel articles alongside maps, providing a smoother and more immersive browsing experience.

![article](/images/landing.png)

### Website URL : https://plan-wander.vercel.app/

### Test

| Test account                              | Test password |
| ----------------------------------------- | ------------- |
| test[@gmail.co](mailto:Alanna@gmail.com)m | 123456        |

## **Technique Overview**

### Front-End
- **Framework:**  Next.js,React(Hook)
- **Language:** TypeScript
- **Styling:** styled-components, CSS
- **State Management:** Zustand
- **Data Fetching:** React-Query
- **Code Formatter:** ESLint, Prettier

### Third-Party Library
- **Drag-and-Drop:** hello-pangea/dnd
- **Maps and Directions:**
  - Mapbox API
  - Mapbox Directions API
- **Autocomplete Search:** Google Autocomplete API
- **Country Information:** Restcountries API
- **Images:** Unsplash API

### Back-End
- **Service:** Firebase (backend-as-a-service)
  - **Database:** Firestore Database
  - **Authentication:** Firebase Admin SDK
  - **Storage:** Firebase Storage

## **Architecture**

![article](/images/architecture.png)

## Main Feature

### Create and Plan Your Itinerary with Ease

- View your itinerary and map seamlessly in one place. Say goodbye to juggling multiple apps, tabs, or tools to organize your travel plans.


![article](/images/demo_search.gif)

### **Easily Edit Your Itinerary with Drag and Drop**

- Effortlessly rearrange your travel plans by simply dragging and dropping items, making itinerary adjustments quick and intuitive.


![article](/images/demo_drag.gif)

### **Explore Stories Alongside the Map**

- Immerse yourself in travel stories while browsing the map, tracing the journey of each destination. Experience attractions through the eyes of others and discover hidden gems as you follow their path.


![article](/images/demo_article.gif)

## OtherFeature

### Effortlessly Share Your Travel Itinerary

- With just a single click, effortlessly share your travel itinerary. Add detailed descriptions and images for each destination, allowing others to explore your journey with ease.


![editArticle](/images/demo_editArticle.gif)

### **Filter Articles by Country**

- Easily find travel articles based on your selected country. Explore relevant stories and insights tailored to your destination of choice.


![filter](/images/demo_filter.gif)
