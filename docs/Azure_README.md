# Process Documentation

This documentation covers four main processes: Azure Storage - container, Azure Maps, Google Geolocation Service, Cosmos DB, and solving MongoDB connection issues related to network firewalls.

## 1. Azure Blobstorage - Container

### 1.1 Create Azure Storage Account

1. Go to the Azure portal and log in.
2. Create a storage account instance named **kavoappstorage** within the resource group **kavoFree**.

### 1.2 Solve Firewall Issues

1. To solve firewall issues, you need to add an existing virtual network or create a new virtual network.
2. Add your public IP address for testing locally.
3. Add the IP addresses used by GitHub Actions. In our case, the range is `213.199.183.0/24`.

### 1.3 Retrieve Access Key or Connection String

1. Open your storage account instance in the Azure portal.
2. Navigate to **Security + Networking** in the sidebar on the left.
3. Go to **Access keys**.
4. Copy the first connection string provided. 
5. Set this connection string as an environment variable:
```env
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=kavoappstorage;AccountKey=f43ZieotGt9rxEpRHLc+F2HlDp4zCKerFSj5KUSjoGPdOFj7Xw8J36P2sKxXAUW8kblRCEddltGy+AStwjRSXQ==;EndpointSuffix=core.windows.net

### 1.4 Setup the Container

1. In your storage account instance, navigate to Data Storage > Containers in the sidebar on the left.
2. Create a new container with a name of your choice, for example, azure-filearchive.
3. After creating the container, click on it and configure the access level.
4. Set Change access level to Container (anonymous read access for containers and blobs).

### 1.5 Accessing Data

- All data stored in this container will have URLs in the following format:
   ```bash
     https://kavoappstorage.blob.core.windows.net/{container_name}/{file_name}
     ```
   - **Example**:
     ```bash
     https://kavoappstorage.blob.core.windows.net/azure-filearchive/test.jpg
     ```

## 2. Cosmos DB

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

## 3. Solving "MongoDB connection failed: Request blocked by network firewall"

1. **Open Cosmos DB Instance**
   - Go to your Cosmos DB instance.
2. **Navigate to Networking**

   - Under settings in the sidebar, select Networking.

3. **Public Access Configuration**
   - As the work is publicly accessible, select "Selected network".
   - In the firewall section, provide your public IP address or IPv4 address.
   - The portal may recommend your IP address automatically.
   - To access from other networks, add the additional IP addresses as needed.


## 4. Adding GitHub Actions IP Addresses to Cosmos DB Firewall Rules

To allow GitHub Actions to connect to your Cosmos DB instance, you need to add GitHub Actions' IP addresses to the Cosmos DB firewall rules. Follow these steps:

### 1. Install and Configure Azure CLI
   - **Download and Install**: Download and install Azure CLI from [here](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli).
   - **Verify Installation**: Open Command Prompt and run `az --version` to verify the installation.
   - **Log In**: Log in to Azure CLI with your account using the command:
     ```bash
     az login --tenant <YOUR_TENANT_ID>
     ```
     Replace `<YOUR_TENANT_ID>` with your Azure Active Directory tenant ID.
   - **Example**:
     ```bash
     az login --tenant c72ee17f-3648-4645-979f-57ed843d2bde
     ```

### 2. Create `update_cosmosdb_firewall.bat` File
   - **Create the File**: Create a file named `update_cosmosdb_firewall.bat` in the same directory as the PowerShell script.
   - **Add the Following Code**:

     ```batch
     @echo off

     rem Define your CosmosDB account name and resource group
     set COSMOSDB_NAME=kavoserver
     set RESOURCE_GROUP=kavoFree

     rem Fetch GitHub Actions IP addresses using PowerShell and filter out IPv6 addresses
     echo Fetching GitHub Actions IP addresses...
     for /f "delims=" %%i in ('powershell -Command "Invoke-RestMethod -Uri https://api.github.com/meta | Select-Object -ExpandProperty actions | Where-Object { $_ -match ''^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+(/([0-9]|[1-2][0-9]|3[0-2]))?$'' }"') do set GITHUB_ACTIONS_IPS=%%i

     rem Format IPs into a comma-separated list
     set "IP_RANGES=%GITHUB_ACTIONS_IPS: =,%"

     rem Update CosmosDB firewall rules
     echo Updating CosmosDB firewall rules with GitHub Actions IP addresses...
     az cosmosdb update --name %COSMOSDB_NAME% --resource-group %RESOURCE_GROUP% --ip-range-filter %IP_RANGES%
     echo Update complete.
     ```

### 3. Run the `update_cosmosdb_firewall.bat` File
   - **Open PowerShell**: Open PowerShell.
   - **Navigate to the Directory**: Navigate to the directory where the `update_cosmosdb_firewall.bat` file is located.
   - **Execute the Script**: Run the script by typing:
     ```powershell
     .\update_cosmosdb_firewall.bat
     ```

## 5. Creating or Adding a Virtual Network for Cosmos DB Networking

Azure Cosmos DB supports network isolation by integrating with Azure Virtual Network. You can either create a new virtual network or add an existing one to enable secure access to your Cosmos DB resources. Follow these steps:

### Creating a New Virtual Network
   - **Navigate to Azure Portal**: Go to the [Azure portal](https://portal.azure.com/).
   - **Create a New Virtual Network**: Click on "Create a resource" > Networking > Virtual network.
   - **Fill in Details**: Provide the necessary details such as name, address space, and subscription.
   - **Configure Subnet**: Add a subnet for Cosmos DB by navigating to "Subnets" and clicking on "+ Subnet". Assign an appropriate address range.
   - **Save and Create**: Review the settings and click on "Review + Create" to create the virtual network.

### Adding an Existing Virtual Network
   - **Navigate to Azure Cosmos DB Networking**: In the Azure portal, go to your Cosmos DB instance.
   - **Access Networking Settings**: Under "Settings", select "Networking".
   - **Configure Virtual Network**: Click on "Add existing virtual network".
   - **Select Virtual Network**: Choose the virtual network from the list or enter the virtual network's resource ID.
   - **Configure Subnet**: Select the subnet within the virtual network to associate with Cosmos DB.
   - **Save Changes**: Review the configuration and save the changes.

By following these steps, you can ensure that your GitHub Actions workflows can connect to your Azure Cosmos DB instance without encountering network firewall issues.


## 6. Azure Maps

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

## 7. Google Geolocation Service

1. **Explore Google Maps SDKs and APIs**

   - Visit [Google Maps](https://developers.google.com/maps).
   - Scroll and explore different SDKs and APIs.
   - Select the Geolocation API.

2. **Check Documentation**

   - Review the Geolocation API documentation.
   - Note: It requires a subscription fee to start using the service.

3. **Guidance Needed**
   - Further guidance is needed as the process requires payment to proceed.

