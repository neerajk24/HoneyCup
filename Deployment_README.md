# Accessing and Modifying Deployed Code on Azure App Service

## Accessing Deployed Code

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

### Viewing GitHub Actions Logs
1. **Navigate to GitHub Repository**: Go to your repo
2. **View Workflow Runs**: `Actions > [Workflow Run]` for detailed logs

