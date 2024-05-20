/* eslint-disable */
interface answers {
    userInput: string;
}
async function question(questionConfig: object): Promise<string> {
    const { default: inquirer } = await import('inquirer');

    return inquirer
        .prompt([
            {
                ...questionConfig,
                name: 'userInput',
            },
        ])
        .then((answers: answers) => {
            return answers.userInput;
        });
}

export { question };
