/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const gridFormRouter = {
  path: '/gridform',
  component: Layout,
  redirect: 'noRedirect',
  name: 'gridform',
  meta: {
    title: '拖拽生成表单',
    icon: 'chart'
  },
  children: [
    {
      path: 'gridform',
      component: () => import('@/views/gridform/gridform'),
      name: 'gridform',
      meta: { title: '拖拽生成表单', noCache: true }
    },
  ]
}

export default gridFormRouter
