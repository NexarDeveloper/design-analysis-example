const releaseById = `
query releaseById ($releaseId: ID!, $first: Int, $after: String){
    desReleaseById (id: $releaseId){
        id
        releaseId
        description
        createdAt
        manufacturePackages {
            downloadUrl
            id
            name
        }
        variants {
            pcbFabrication {
                downloadUrl
            }
            pcb {
                documentId
                documentName
                designItems (
                    first: $first,
                    after: $after
                ){
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                    totalCount
                    nodes {
                        id
                        area {
                            pos1 {
                                x
                                y
                            }
                            pos2 {
                                x
                                y
                            }
                        }
                        component {
                            details {
                                parameters {
                                    name
                                    type
                                    value
                                }
                            }
                        }
                    }
                }
                layerStack {
                    stacks {
                        name
                        layers {
                            name
                            layerType
                            thickness {
                                x
                            }
                            nets {
                                tracks {
                                    begin {
                                        x
                                        y
                                    }
                                }
                            }
                        }
                    }
                }
                size {
                    x
                    y
                }
            }
        }
    }
}
`;

const createCommentThread = `
mutation createCommentThread ($documentId: String!, $projectId: ID!, $text: String!, $releaseId: String, $designItemId: ID, $documentType: DesDocumentType!, $commentContextType: DesCommentContextType!, $area: DesRectangleInput){
    desCreateCommentThread (
        input: {
            documentType: $documentType,
            documentId: $documentId,
            entityId: $projectId,
            text: $text,
            releaseId: $releaseId,
            commentContextType: $commentContextType,
            itemAsDesignItemId: $designItemId,
            area: $area
        }
    ){
        commentThreadId
        commentId
    }
}
`;

const createTask = `
mutation createTask ($projectId: ID!, $taskName: String!, $taskDescription: String!, $priority: DesTaskPriority, $status: DesTaskStatus){
    desCreateProjectTask (
        input: {
            projectId: $projectId
            task: {
                name: $taskName
                description: $taskDescription
                priority: $priority
                status: $status
            }
        }
    ){
        task {
            id
            refId
        }
    }
}
`;

const updateTask = `
mutation updateTask ($taskId: ID!, $status: DesTaskStatus, $taskName: String, $taskDescription: String){
    desUpdateTask (
        input: {
            taskId: $taskId
            status: $status
            name: $taskName
            description: $taskDescription
        }
    ){
        errors {
            message
        }
    }
}
`;

const createTaskComment = `
mutation createTaskComment ($taskId: ID!, $text: String!) {
    desCreateTaskComment (
        input: {
            taskId: $taskId
            text: $text
        }
    ){
        comment {
            text
            commentId
        }
    }
}
`;

module.exports = {
  releaseById,
  createCommentThread,
  createTask,
  updateTask,
  createTaskComment,
};
