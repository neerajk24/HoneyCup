# GitHub Actions Best Practices for Azure App Service Deployments

## Accessing and Modifying Deployed Code on Azure App Service

### Azure Portal
1. **Navigate to Portal**: [portal.azure.com](https://portal.azure.com)
2. **Select App Service**: In the sidebar, go to `App Services > [Your App Service]`

### Advanced Tools (Kudu)
1. **Open Kudu**: In the app service menu, go to `Development Tools > Advanced Tools > Go`
2. **Use Kudu Console**:
    - Navigate to `Debug console > CMD/PowerShell`
    - Browse to `site/wwwroot` to see your deployed code
    - Edit files directly in Kudu

### FTP/FTPS
1. **Enable FTP**: In Azure Portal, go to `App Service > Deployment Center > FTPS Credentials`
2. **Connect via FTP**: Use an FTP client (e.g., FileZilla) with the provided credentials to access and modify files

## Making Changes Without CI/CD
1. **Download Code**: Use Kudu or FTP to download code from `site/wwwroot`
2. **Modify Locally**: Make changes on your local machine
3. **Upload Changes**: Use FTP to upload modified files back to `site/wwwroot`

## Checking Deployment History

### Azure Portal
1. **Navigate to Deployment Center**: `App Service > Deployment Center`
2. **View Deployment History**: Check deployment logs for date, time, commit ID, and status

### Using Kudu (Advanced Tools)
1. **Open Kudu**: `App Service > Development Tools > Advanced Tools > Go`
2. **Check Logs**: Navigate to `Site extensions > Log Files > site > deployments`

### Using Azure CLI
1. **Log in**: Open terminal, run `az login`
2. **List Deployment Logs**:
    ```sh
    az webapp deployment list -n <your-app-service-name> -g <your-resource-group-name>
    ```

## GitHub Actions Best Practices

1. **Set Longer Timeout for Async Functions**: During deployment, set longer timeout durations, such as 60000ms, for each async function to ensure that deployment processes complete successfully.
   
2. **Pass IP Address for Cloud Database Access**: When connecting to a cloud database like Azure Cosmos DB, consider passing the IP address of your GitHub Actions workflow to allow access through the database firewall. This helps prevent errors such as "Request blocked by network firewall." You can find the default IP addresses used by GitHub Actions in the documentation [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses).

3. **Combine Test Commands**: To streamline your testing process, combine different test commands into a single script, such as `npm run testall-combined`. This simplifies the execution of tests during deployment.

4. **Configure Firewall Access**: Ensure that the IP address used by GitHub Actions is whitelisted in your database networking settings. In Azure Cosmos DB, add the GitHub Actions IP addresses by navigating to the instance settings, selecting "Networking" from the sidebar, choosing "Public access," selecting "Selected networks," and adding the GitHub Actions IP addresses (e.g., 192.30.252.0/22, 185.199.108.0/22, 140.82.112.0/20, 143.55.64.0/20) along with your personal IP address. Save the settings and wait for Azure to update its networking configuration.
