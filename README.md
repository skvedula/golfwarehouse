# thegolfwarehouse.platform

BB Platform implementation of The Golf Warehouse

## Table of Contents
 * [Environments](#environments)
 * [Deployments](#deployments)

# Environments 

URL | Branch | Environment
--- | --- | ---
http://m.tgw.com | master | prod
http://thegolfwarehouse-platform.uat.bbhosted.com | master | uat
http://thegolfwarehouse-platform-dev01.uat.bbhosted.com | dev01 | uat
http://thegolfwarehouse-platform-dev02.uat.bbhosted.com | dev02 | uat

# Deployments 

Build Status (1m cache)  
[![Build Status Image](http://github-proxy.uat.bbhosted.com/repos/readmeimage/thegolfwarehouse.platform)](#)

## UAT (Master Branch)
* [Last Deploy Diff](https://github.com/brandingbrand/thegolfwarehouse.platform/compare/uat-thegolfwarehouse_platform-fallback...uat-thegolfwarehouse_platform-current)
* [Pending Deploy Diff](https://github.com/brandingbrand/thegolfwarehouse.platform/compare/uat-thegolfwarehouse_platform-current...thegolfwarehouse_platform-master-docker-latest)
* [Deploy](https://jenkins.brandingbrand.com/job/thegolfwarehouse.platform/parambuild/?REF=thegolfwarehouse_platform-master-docker-latest&ACTION=Deploy%20to%20UAT)
 
## UAT (Dev01 Branch)
* [Last Deploy Diff](https://github.com/brandingbrand/thegolfwarehouse.platform/compare/uat-thegolfwarehouse_platform-dev01-fallback...uat-thegolfwarehouse_platform-dev01-current)
* [Pending Deploy Diff](https://github.com/brandingbrand/thegolfwarehouse.platform/compare/uat-thegolfwarehouse_platform-dev01-current...thegolfwarehouse_platform-dev01-dev01-docker-latest)
* [Deploy](https://jenkins.brandingbrand.com/job/thegolfwarehouse.platform/parambuild/?REF=thegolfwarehouse_platform-dev01-dev01-docker-latest&ACTION=Deploy%20to%20UAT)

## UAT (Dev02 Branch)
* [Last Deploy Diff](https://github.com/brandingbrand/thegolfwarehouse.platform/compare/uat-thegolfwarehouse_platform-dev02-fallback...uat-thegolfwarehouse_platform-dev02-current)
* [Pending Deploy Diff](https://github.com/brandingbrand/thegolfwarehouse.platform/compare/uat-thegolfwarehouse_platform-dev02-current...thegolfwarehouse_platform-dev02-dev02-docker-latest)
* [Deploy](https://jenkins.brandingbrand.com/job/thegolfwarehouse.platform/parambuild/?REF=thegolfwarehouse_platform-dev02-dev02-docker-latest&ACTION=Deploy%20to%20UAT)

## PROD  
* [Last Deploy Diff](https://github.com/brandingbrand/thegolfwarehouse.platform/compare/prod-thegolfwarehouse_platform-fallback...prod-thegolfwarehouse_platform-current)
* [Pending Deploy Diff](https://github.com/brandingbrand/thegolfwarehouse.platform/compare/prod-thegolfwarehouse_platform-current...uat-thegolfwarehouse_platform-current)
* [Deploy](https://jenkins.brandingbrand.com/job/thegolfwarehouse.platform/parambuild/?REF=uat-thegolfwarehouse_platform-current&ACTION=Deploy%20to%20Prod)

# IMPORTANT!
*Do not deploy to production without UAT testing & approval from Northern Tool / Kotulas / TGW*
