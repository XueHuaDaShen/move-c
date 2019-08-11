const u = {
  query2Dict(search) {
    const pattern = /([^?&=]+)=([^&#]*)/g;
    const dict = {};

    search.replace(pattern, (rs, $1, $2) => {
      const key = $1;
      const value = $2;
      dict[key] = decodeURIComponent(value);
    });
    return dict;
  },
  genUrlParams(params = {}) {
    const url = Object.keys(params).filter(key => (params[key] !== undefined) && (params[key] !== null)).filter(key => key !== 'maApp').map((key) => {
      const val = params[key];
      let encodeUrl = '';
      if (Object.prototype.toString.call(val).indexOf('String') !== -1) {
        encodeUrl = `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
      } else {
        encodeUrl = `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(val))}`;
      }
      return encodeUrl;
    })
      .join('&');
    return url;
  },
  filterQuery(query, keys) {
    const filterDict = (obj, $keys) => {
      const rs = {};
      Object.keys(obj)
        .filter(key => $keys.indexOf(key) === -1)
        .forEach((key) => {
          rs[key] = obj[key];
        });
      return rs;
    };

    const _query = this.query2Dict(query);
    const reduceQuery = filterDict(_query, keys);
    const queryUrl = this.genUrlParams(reduceQuery);
    return queryUrl;
  },
};

export default u;
