import { lazy } from "react"

const Background = lazy(()=>import("../components/index specific/3dbackground"))
const Content = lazy(()=>import("../components/index specific/content"))

function Index(): JSX.Element {
  

  return (
    <>
      
        <Background/>

        <Content/>
      
    </>
  )
}

export default Index
