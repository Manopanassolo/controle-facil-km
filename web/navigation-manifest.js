(function(g){
  const items=[
    {key:'home',label:'Home',href:'/',area:'core'},
    {key:'commercial',label:'Inteligência Comercial',href:'/commercial-intelligence.html',area:'management'},
    {key:'agenda',label:'Agenda',route:'agenda',area:'operation'},
    {key:'routes',label:'Deslocamentos / Rotas',route:'deslocamentos',area:'operation'},
    {key:'km',label:'KM',route:'km',area:'operation'},
    {key:'expenses',label:'Abastecimentos / Despesas',route:'despesas',area:'operation'},
    {key:'reports',label:'Relatórios',route:'relatorios',area:'management'},
    {key:'clients',label:'Clientes',route:'clientes',area:'commercial'},
    {key:'vehicles',label:'Veículos',route:'veiculos',area:'management'},
    {key:'admin',label:'Administração',area:'admin',children:[
      {key:'users',label:'Usuários',route:'usuarios'},
      {key:'teams',label:'Equipes',route:'equipes'},
      {key:'branches',label:'Lojas',route:'lojas'},
      {key:'approvals',label:'Aprovações',route:'aprovacoes'},
      {key:'settings',label:'Configurações',route:'configuracoes'}
    ]}
  ];
  g.MOVVANT_WEB_NAV={version:1,items};
})(window);
