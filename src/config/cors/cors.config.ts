const corsOrigins = [/^(http|https):\/\/(localhost)(:\d+)?$/, process.env.FRONTEND_URL].filter(
    Boolean
);

export default {
    credentials: true,
    origin: corsOrigins as (string | RegExp)[],
};
