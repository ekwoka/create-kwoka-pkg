import { exec } from 'child_process';

export function execShellCommand(cmd: string) {
  return new Promise((res) => {
    exec(cmd, (_, stdout, stderr) => {
      res(stdout ? stdout : stderr);
    });
  });
}
