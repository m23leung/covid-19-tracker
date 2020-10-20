COVID-19 TRACKER

Description: Displays the latest worldwide COVID-19 numbers with statistical data including grpahs, tables, and region map

Author: Mark Leung

Live Demo URL:
https://covid-19-tracker-adb51.web.app/

Notes:
- Built with React JS, Chart JS, and Leaflet Maps

- There might be some bugs with the API which does not return data. Will need to change backend API to a more reliable one that returns up-to-date accurate COVID-19 data.

Features:
- Left app shows country specific data
- Right app shows worldwide specific data

How to use:
- If setting allowed, the browser will pick up the user's current country and pre-populate the daily cases/recovered/deaths tables, map, and daily graph.
- Select a country with the dropdown.
- Select between the 3 tables, daily cases/recovered/deaths to filter the map and graph.

- Map displays daily cases/recovered/deaths based on selected country and case type selected from table.
  - Click on a specific country circle on map, to display a country specific pop-up. A neat flag will be shown.
  
- Bottom graph displays daily cases/recovered/deaths based on selected country and case type selected from table.
