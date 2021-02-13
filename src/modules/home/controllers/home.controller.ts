/**
 * Module dependencies
 */
import { NextFunction, Response } from 'express';
import fs from 'fs';
import getMessage from '../../../lib/helpers/errors';
import { error, NodeRequest, success } from '../../../lib/helpers/responses';
import * as HomeService from '../services/home.service';
/**
 * @desc Endpoint to ask the service to get the releases
 */
export async function releases(req: NodeRequest, res: Response) {
  try {
    const results = await HomeService.releases();
    success(res, 'releases')(results);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to get the changelogs
 */
export async function changelogs(req: NodeRequest, res: Response) {
  try {
    const results = await HomeService.changelogs();
    success(res, 'changelogs')(results);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to get the list of users
 */
export async function team(req: NodeRequest, res: Response) {
  try {
    const users = await HomeService.homeTeam();
    success(res, 'team list')(users);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc Endpoint to ask the service to get a page
 */
export async function page(req: NodeRequest, res: Response) {
  try {
    success(res, 'page')(req.page);
  } catch (err) {
    error(res, 422, 'Unprocessable Entity', getMessage(err))(err);
  }
}

/**
 * @desc MiddleWare to ask the service the file for this name
 */
export async function pageByName(req: NodeRequest, res: Response, next: NextFunction, name: string) {
  try {
    if (!fs.existsSync(`./config/markdown/${name}.md`)) return error(res, 404, 'Not Found', 'No page with that name has been found')();
    req.page = await HomeService.page(name);
    next();
  } catch (err) {
    next(err);
  }
}
