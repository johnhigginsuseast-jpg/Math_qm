'use strict';
// GitHub Pages learning edition: no credentials, API requests or server-side accounts.
const Auth={
  online:false,
  guest:true,
  start:catalogue=>catalogue(),
  saveCompletion:(_id,onSaved)=>onSaved()
};

