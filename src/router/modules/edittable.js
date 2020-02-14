/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const editTableRouter = {
  path: '/edittable',
  component: Layout,
  redirect: 'noRedirect',
  name: 'EditTable',
  meta: {
    title: '可编辑表格',
    icon: 'chart'
  },
  children: [
    {
      path: 'flow',
      component: () => import('@/views/edittable/edittable'),
      name: 'Flow',
      meta: { title: '可编辑表格', noCache: true }
    },
  ]
}

export default editTableRouter
