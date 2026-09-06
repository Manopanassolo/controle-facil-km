(function(g){
 const ROLE={user:1,seller:1,driver:1,supervisor:2,manager:3,admin:4,master:5,owner:5};
 const norm=v=>String(v||'').trim().toLowerCase();
 function build(session={}){
  const role=norm(session.role||session.profile||'user');
  const level=ROLE[role]||1;
  const companyId=session.companyId||session.company_id||null;
  const userId=session.userId||session.user_id||session.id||null;
  const branchIds=[...(session.branchIds||session.branch_ids||[])].filter(Boolean);
  const teamIds=[...(session.teamIds||session.team_ids||[])].filter(Boolean);
  return {role,level,companyId,userId,branchIds,teamIds,canCompany:level>=4,canBranch:level>=3,canTeam:level>=2,canSelf:true};
 }
 function allowedScopes(a){return ['self',...(a.canTeam?['team']:[]),...(a.canBranch?['branch']:[]),...(a.canCompany?['company']:[])];}
 function sanitize(request={},access=build()){
  const scopes=allowedScopes(access);const scope=scopes.includes(request.scope)?request.scope:scopes[scopes.length-1];
  const branchIds=access.canCompany?(request.branchIds||access.branchIds):access.branchIds;
  const teamIds=access.canBranch?(request.teamIds||access.teamIds):access.teamIds;
  const userIds=scope==='self'?[access.userId].filter(Boolean):(request.userIds||[]);
  return {...request,scope,companyId:access.companyId,branchIds,teamIds,userIds};
 }
 g.MOVVANT_ACCESS={build,allowedScopes,sanitize};
})(window);