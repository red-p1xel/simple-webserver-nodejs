import path from 'node:path';
import fs from 'node:fs/promises';

interface FileData <T, S> {
  path: T,
  content: S
}

/* The following example also can suitable to declare array of FileData objects instead of interface which declared above
  type FileData = {
    path: string,
    content: Buffer
  };
*/

let files: Array<FileData<string, Buffer>> = [];

export interface File {
  dir: string;
  extensions?: string[];
}

export async function loadFiles(dir: string, extensions?: string[]) {
  const targetDir = await fs.readdir(dir);

  for (const item of targetDir) {
    const currentPath = `${dir}/${item}`;
    const stats = await fs.lstat(currentPath);

    if (stats.isDirectory()) await loadFiles(currentPath, extensions);
    if (stats.isFile()) {
      const extension = item.split('.').pop() || '';
      const ignoreFile = extensions?.length
        ? !extensions.includes(extension)
        : false;

      if (ignoreFile) continue;
      const filePath = path.resolve(currentPath);
      const fileContent = await fs.readFile(filePath);
      files = [...files, { path: filePath, content: fileContent }];
    }
  }

  return files;
}
