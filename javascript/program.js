const apiQueries = require("./apiQueries");
const apiEnums = require("./apiEnums");
const nx = require("./nexarClient");
const clientId =
  process.env.NEXAR_CLIENT_ID ??
  (() => {
    throw new Error("Please set environment variable 'NEXAR_CLIENT_ID'");
  })();
const clientSecret =
  process.env.NEXAR_CLIENT_SECRET ??
  (() => {
    throw new Error("Please set environment variable 'NEXAR_CLIENT_SECRET'");
  })();

const nexar = new nx.NexarClient(
  clientId,
  clientSecret,
  nx.NexarClient.scopes.design
);

const getReleaseDataPage = (releaseId, pageSize, after) => {
  return nexar.query(apiQueries.releaseById, {
    releaseId: releaseId,
    first: pageSize,
    after: after,
  });
};

const getReleaseData = async (releaseId, pageSize) => {
  const response = await getReleaseDataPage(releaseId, pageSize, null);
  let data = response.data;
  let pageInfo = data.desReleaseById.variants[0].pcb.designItems.pageInfo;
  while (pageInfo.hasNextPage) {
    let newPage = await getReleaseDataPage(
      releaseId,
      pageSize,
      pageInfo.endCursor
    );
    newPage.data.desReleaseById.variants[0].pcb.designItems.nodes.forEach(
      (node) => {
        data.desReleaseById.variants[0].pcb.designItems.nodes.push(node);
      }
    );
    pageInfo = newPage.data.desReleaseById.variants[0].pcb.designItems.pageInfo;
  }
  return data;
};

const createCommentOnComponent = (
  releaseId,
  projectId,
  documentId,
  text,
  designItemId
) => {
  const variables = {
    documentId: documentId,
    text: text,
    designItemId: designItemId,
    projectId: projectId,
    releaseId: releaseId,
    documentType: apiEnums.documentType.pcb,
    commentContextType: apiEnums.commentContextType.component,
    area: null,
  };
  return nexar
    .query(apiQueries.createCommentThread, variables)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const createCommentOnArea = (
  releaseId,
  projectId,
  documentId,
  text,
  pos1x,
  pos1y,
  pos2x,
  pos2y
) => {
  const variables = {
    documentId: documentId,
    text: text,
    designItemId: null,
    projectId: projectId,
    releaseId: releaseId,
    documentType: apiEnums.documentType.pcb,
    commentContextType: apiEnums.commentContextType.area,
    area: {
      pos1: {
        x: pos1x,
        y: pos1y,
      },
      pos2: {
        x: pos2x,
        y: pos2y,
      },
    },
  };
  return nexar
    .query(apiQueries.createCommentThread, variables)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const createTask = async (
  projectId,
  taskName,
  taskDescription,
  priority,
  status
) => {
  const response = await nexar.query(apiQueries.createTask, {
    projectId: projectId,
    taskName: taskName,
    taskDescription: taskDescription,
    priority: priority,
    status: status,
  });
  return response.data.desCreateProjectTask.task.id;
};

const updateTask = (taskId, status, name, description) => {
  nexar
    .query(apiQueries.updateTask, {
      taskId: taskId,
      status: status,
      taskName: name,
      taskDescription: description,
    })
    .catch((error) => {
      console.log(error);
    });
};

const createTaskComment = (taskId, comment) => {
  nexar.query(apiQueries.createTaskComment, {
    taskId: taskId,
    text: comment,
  });
};

const runAnalysis = async (releaseId, projectId, release, taskId) => {
  const documentId = release.variants[0].pcb.documentId;
  try {
    // Analysis on design items
    release.variants[0].pcb.designItems.nodes.forEach((designItem) => {
      const noOfPins = designItem.component.details.parameters.find(
        (e) => e.name == "Pins"
      ).value;
      if (noOfPins > 20) {
        createCommentOnComponent(
          releaseId,
          projectId,
          documentId,
          `This component has ${noOfPins} pins.`,
          designItem.id
        );
      }
    });

    // Analysis on size
    const boardSize = release.variants[0].pcb.size;
    if (boardSize) {
      await createCommentOnArea(
        releaseId,
        projectId,
        documentId,
        `The size of this board is ${boardSize.x}x${boardSize.y}`,
        0,
        0,
        0,
        0
      );
    }

    updateTask(
      taskId,
      apiEnums.taskStatus.resolved,
      `Completed: Analysis for ${release.description}`
    );
    createTaskComment(
      taskId,
      `Analysis report available at https://www.myanalysispdf.com`
    );
  } catch {
    updateTask(
      taskId,
      apiEnums.taskStatus.resolved,
      `Failed: Analysis for ${release.description}`
    );
  }
};

const main = async (releaseId, projectId) => {
  const data = await getReleaseData(releaseId, 100);
  const taskId = await createTask(
    projectId,
    `Running: Analysis for ${data.desReleaseById.description}`,
    "This is a task for running analysis on this project.",
    apiEnums.taskPriorities.medium,
    apiEnums.taskStatus.inProgress
  );
  runAnalysis(releaseId, projectId, data.desReleaseById, taskId);
};

const releaseId = "Your release ID here";

const projectId = "Your project ID here";

main(releaseId, projectId);
