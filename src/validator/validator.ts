import { celebrate, Joi } from 'celebrate';

export const userIdValidator = celebrate({
  params: Joi.object()
    .keys({ userId: Joi.string().length(24).required() }),
});

export const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const userUpdateValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

export const userCreationValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const avatarUpdateValidator = celebrate({ body: Joi.object().keys({ avatar: Joi.string().pattern(/^(http|https):\/\/[a-zA-Z0-9]+([-.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?((\/[a-zA-Z0-9%-~]+)*)?(#[a-zA-Z0-9_%-]*)?$/).required() }) });

export const cardCreationValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .required()
      .pattern(/^(http|https):\/\/[a-zA-Z0-9]+([-.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?((\/[a-zA-Z0-9%-~]+)*)?(#[a-zA-Z0-9_%-]*)?$/).required(),
  }),
});

export const cardIdValidator = celebrate({
  params: Joi.object()
    .keys({ cardId: Joi.string().length(24).required() }),
});
