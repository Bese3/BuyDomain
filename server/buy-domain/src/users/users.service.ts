import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  private filePath = path.join(__dirname, '../../data/userDomains.json');

  private readFile(): CreateUserDto[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data || '[]');
  }

  private writeFile(data: CreateUserDto): void {
    const previousData = this.readFile();

    previousData.push(data);
  
    fs.writeFileSync(this.filePath, JSON.stringify(previousData, null, 2), 'utf-8');
  }

  create(createUserDto: CreateUserDto) {
    createUserDto.purchaseDate = (new Date()).toString()
    const newUser = createUserDto;
    this.writeFile(newUser);
    return newUser;
  }

  findAll() {
    return this.readFile();
  }

  findOne(email: string) {
    return `This action returns a #${email} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
