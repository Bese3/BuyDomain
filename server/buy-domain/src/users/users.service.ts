import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  private filePath = path.join(__dirname, '../../data/userDomains.json');

  private readFile() {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data || '[]');
  }

  private writeFile(data: CreateUserDto): void {
    const previousData = this.readFile();

    previousData.push(data);
  
    fs.writeFileSync(this.filePath, JSON.stringify(previousData, null, 2), 'utf-8');
  }

  findOne(email: string) {
    const users = this.readFile()
    const user = users.find((data) => data.email === email)
    return {
      domains: user?.domains
    }
  }
}
