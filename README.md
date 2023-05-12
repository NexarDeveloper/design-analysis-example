# Design Analysis Example

This example is to show how you can use the Nexar API to retrieve data to be analyzed, and then feed back the results to the design via the API. It is not an example of an actual analysis of a design.

## Prerequisites

You should have a [Nexar](https://nexar.com/) application with the design scope as well as being a member of an [Altium 365](https://www.altium.com/altium-365) workspace. In that workspace you should have a project that has a release.

If you are an Altium 365 user but not yet a Nexar user you should be able to sign in with your 365 credentials. Here is our [API Introduction & Key Concepts Documentation](https://support.nexar.com/support/solutions/folders/101000428490).

Your client credentials ([where to find your client credentials](https://support.nexar.com/support/solutions/articles/101000452099-where-do-i-find-my-client-id-and-client-secret-)) should be set as environment variables. Alternatively, change the script to input them there. You will also need to input a release ID and project ID. If you don't happen to know these off the top of your head, below is an API query which you can use to fetch all of your projects and their releases for a given workspace. You can take your workspace URL from the top bar in your browser (up to ".com") when in your Altium 365 workspace.

```
query projectReleases {
    desProjects (
        workspaceUrl: "Your workspace URL here"
    ){
        nodes {
            id
            name
            design {
                releases {
                    nodes {
                        description
                        releaseId
                        id
                    }
                }
            }
        }
    }
}
```
