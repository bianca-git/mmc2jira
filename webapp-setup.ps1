# $Env:SITENAME=
# $Env:SUBSCRIPTION=
# $Env:RESOURCEGROUP=
# $Env:SUBSCRIPTIONID=
# $Env:LOCATION="australiasoutheast"
# $Env:PLANNAME=
# $Env:PLANSKU="F1"

# login supports device login, username/password, and service principals
# see https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest#az_login
az login
# list all of the available subscriptions
az account list -o table
# set the default subscription for subsequent operations
az account set --subscription $Env:SUBSCRIPTION
# create a resource group for your application
az group create --name $Env:RESOURCEGROUP --location $Env:LOCATION
# create an appservice plan (a machine) where your site will run
az appservice plan create --name $Env:PLANNAME --location $Env:LOCATION --sku $Env:PLANSKU --resource-group $Env:RESOURCEGROUP
# create the web application on the plan
# specify the node version your app requires
az webapp create --name $Env:SITENAME --plan $Env:PLANNAME --resource-group $Env:RESOURCEGROUP

# To set up deployment from a local git repository, uncomment the following commands.
# first, set the username and password (use environment variables!)
# $Env:USERNAME=$Env:AZ_USERNAME
# $Env:PASSWORD=$Env:AZ_PASSWORD
az webapp deployment user set --user-name $Env:AZ_USERNAME --password $Env:AZ_PASSWORD

# now, configure the site for deployment. in this case, we will deploy from the local git repository
# you can also configure your site to be deployed from a remote git repository or set up a CI/CD workflow
az webapp deployment source config-local-git --name $Env:SITENAME --resource-group $Env:RESOURCEGROUP

# the previous command returned the git remote to deploy to
# use this to set up a new remote named "azure"
git remote add azure "https://$Env:USERNAME@$Env:SITENAME.scm.azurewebsites.net/$SITENAME.git"
# push master to deploy the site
git push azure main

# browse to the site
az webapp browse --name $Env:SITENAME --resource-group $Env:RESOURCEGROUP


# To deploy from a remote git repository, uncomment the following commands.
# https://github.com/Azure/actions-workflow-samples/blob/master/assets/create-secrets-for-GitHub-workflows.md
az ad sp create-for-rbac --name "$Env:SUBSCRIPTION" --role contributor --scopes /subscriptions/$Env:SUBSCRIPTIONID/resourceGroups/$Env:SUBSCRIPTION --sdk-auth