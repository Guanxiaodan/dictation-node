function useClientDomain() {
  return process.env.NODE_ENV === "production"
    ? process.env.CLIENT_PRODUCTION_DOMAIN
    : process.env.CLIENT_DEV_DOMAIN;
}
module.exports = {
  useClientDomain,
};
