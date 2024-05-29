# Process Documentation

This documentation covers four main processes: Azure Maps, Google Geolocation Service, Cosmos DB, and solving MongoDB connection issues related to network firewalls.

## 1. Azure Maps

1. **Create an Instance**
   - Go to Azure Maps Marketplaces.
   - Create a new instance by providing an instance name.
2. **Find Azure Maps API Key**

   - Navigate to the authentication section from the sidebar of the instance name created earlier.
   - Use the primary key as `AZURE_MAPS_API_KEY`.

3. **Write a `geolocation.js` File**
   - Access the API JSON file with the following code:
     ```javascript
     const response = await axios.get(
       "https://atlas.microsoft.com/geolocation/ip/json",
       {
         params: {
           "subscription-key": AZURE_MAPS_API_KEY,
         },
         headers: {
           Accept: "application/json",
           "User-Agent": "axios/1.7.2",
         },
       }
     );
     ```
   - Ensure you provide the Azure Maps API key along with your public IP address.
   - Example API call:
     ```
     https://atlas.microsoft.com/geolocation/ip/json?subscription-key=8GVwJf6Ra91GPhoM1Txx6d0JIu1jb8MM0RcvzZGlZ7ybGGyRInK8JQQJ99AEACYeBjF59nzlAAAgAZMPCGoI&ip=103.176.156.10
     ```

## 2. Google Geolocation Service

1. **Explore Google Maps SDKs and APIs**

   - Visit [Google Maps](https://developers.google.com/maps).
   - Scroll and explore different SDKs and APIs.
   - Select the Geolocation API.

2. **Check Documentation**

   - Review the Geolocation API documentation.
   - Note: It requires a subscription fee to start using the service.

3. **Guidance Needed**
   - Further guidance is needed as the process requires payment to proceed.

## 3. Cosmos DB

1. **Create a Cosmos DB Instance**

   - Go to the Azure website and log in.
   - Search for Azure Cosmos DB for MongoDB service.
   - Select RU (Request Unit) for the instance type.
   - Provide instance details like name and create the instance.

2. **Access Connection String**

   - Open your Cosmos DB instance.
   - Navigate to Quickstart from the sidebar.
   - Use the provided connection string for your programming language (Node.js in this case).

3. **Use Connection String**
   - Replace the local database URL with the Cosmos DB connection string in your application.

## 4. Solving "MongoDB connection failed: Request blocked by network firewall"

1. **Open Cosmos DB Instance**
   - Go to your Cosmos DB instance.
2. **Navigate to Networking**

   - Under settings in the sidebar, select Networking.

3. **Public Access Configuration**
   - As the work is publicly accessible, select "Selected network".
   - In the firewall section, provide your public IP address or IPv4 address.
   - The portal may recommend your IP address automatically.
   - To access from other networks, add the additional IP addresses as needed.
