const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const YAML = require('yaml');
const fs = require('fs');

const { argv } = require('yargs')
  .option('aws')
  .option('local');

module.exports = (async () => {
  const projectName = path.basename(path.dirname(__dirname, '..'))
  
  let username = argv.aws ? process.env.ECR_URL : '';
  username = argv.local ? process.env.DOCKERHUB_USER : username;

  // make the version dependant on something else
  const version = 'latest'

  // names of the original and ecs docker compose
  const originalDockerCompose = 'docker-compose.yml';
  const ecsDockerCompose = './infrastructure/docker-compose.ecs.yml';
  const ecsParams = './infrastructure/ecs-params.yml';

  console.log('Input file:', originalDockerCompose);
  console.log('Output file:', ecsDockerCompose);

  console.log('Building...');
  await exec(`docker-compose -f ${originalDockerCompose} build`);
  console.log('Built');

  const stack = YAML.parse(fs.readFileSync(originalDockerCompose, 'utf-8'));
  // const ecsStackParams = YAML.parse(fs.readFileSync(ecsParams, 'utf-8'));

  const { services } = stack;
  const serviceNames = Object.keys(services);

  const pushOperations = [];

  for (let i = 0; i !== serviceNames.length; i++) {
    const serviceName = serviceNames[i];
    const service = services[serviceName];

    if (service.build) {
      const composeImage = `${projectName}_${serviceName}`;
      const hubImage = `${username}/${composeImage}:${version}`;

      await exec(`docker tag ${composeImage} ${hubImage}`);
      console.log(`Tagged: ${composeImage} => ${hubImage}`);

      pushOperations.push(async () => await exec(`docker push ${hubImage}`));

      // Object.assign(service, ecsStackParams.services[serviceName]);
      
      delete service.build;
      service.image = hubImage;
    }
  }

  if (argv.aws || argv.local)
    await Promise.all(pushOperations.map(async item => await item()));

  // fs.writeFileSync(ecsDockerCompose, YAML.stringify(stack));
  // console.log('Saved build to:', ecsDockerCompose);

})();