/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const flowRouter = {
  path: '/flow',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Flow',
  meta: {
    title: '简单流程图',
    icon: 'chart'
  },
  children: [
    {
      path: 'flow',
      component: () => import('@/views/flow/flow'),
      name: 'Flow',
      meta: { title: '简单流程图', noCache: true }
    },
  ]
}

export default flowRouter
