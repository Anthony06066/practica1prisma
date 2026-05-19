import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // User endpoints
  @Get('users')
  getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Post('users')
  createUser(@Body() body: { email: string; name: string; age?: number; bio?: string }) {
    return this.appService.createUser(body.email, body.name, body.age, body.bio);
  }

  @Get('users/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getUserById(id);
  }

  @Put('users/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { email?: string; name?: string; age?: number; bio?: string },
  ) {
    return this.appService.updateUser(id, body.email, body.name, body.age, body.bio);
  }

  @Delete('users/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteUser(id);
  }

  // Music endpoints
  @Get('music')
  getAllMusic() {
    return this.appService.getAllMusic();
  }

  @Post('music')
  createMusic(@Body() body: { title: string; artist: string; genre?: string }) {
    return this.appService.createMusic(body.title, body.artist, body.genre);
  }

  @Get('music/:id')
  getMusicById(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getMusicById(id);
  }

  @Put('music/:id')
  updateMusic(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title?: string; artist?: string; genre?: string },
  ) {
    return this.appService.updateMusic(id, body.title, body.artist, body.genre);
  }

  @Delete('music/:id')
  deleteMusic(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteMusic(id);
  }

  // Like endpoints
  @Post('likes')
  createLike(@Body() body: { likerId: number; likedId: number }) {
    return this.appService.createLike(body.likerId, body.likedId);
  }

  @Get('users/:id/likes')
  getLikesForUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getLikesForUser(id);
  }

  // Match endpoints
  @Get('users/:id/matches')
  getMatchesForUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getMatchesForUser(id);
  }

  // Message endpoints
  @Post('messages')
  sendMessage(@Body() body: { matchId: number; senderId: number; content: string }) {
    return this.appService.sendMessage(body.matchId, body.senderId, body.content);
  }

  @Get('matches/:id/messages')
  getMessagesForMatch(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getMessagesForMatch(id);
  }
}
