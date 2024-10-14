import React, {useState, useEffect} from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer'
import Expression from '../components/Expression';
import axios from 'axios';


import '../styles/RecognitionLevel.scss';



export default function RecognitionLevel() {
  const { isLoggedIn, getProfile } = useAuth();
  if (!isLoggedIn() ) {
    window.location.href = "/notFound";
  }

  const {recognitionLevelId, recognitionLevel} = useParams();
  const[expressions, setExpressions] = useState([]);
  


  useEffect(() => {
      axios.get(process.env.REACT_APP_BACKEND_LOCALHOST + `/expressions/${getProfile().user_id}`)
           .then(response => {
                  setExpressions(response.data); 
                  console.log(response.data)
            })
           .catch(console.log);
  },[])

  const updateExpressions = (newList) => {
    setExpressions(newList);
  }

  

  const filterExpressions = ()=>{
      return expressions
              .filter(exp => exp.recognition_level_id === parseInt(recognitionLevelId));
  }

  return (
    <div>

      <h2> {recognitionLevel} <span> ({filterExpressions().length}) </span> </h2>
  

      <section className='expressions-section'>
        {
            filterExpressions()
              .map(exp => 
                  <Expression 
                      key={exp.expression_id}
                      expressionId={exp.expression_id}
                      expression={exp.expression}
                      shortdef={exp.def.meaning}
                      prs={exp.def.prs && exp.def.prs}
                      audioName={exp.def.audioName && exp.def.audioName}
                      fl={exp.def.fl && exp.def.fl}
                      stems={exp.def.stems && exp.def.stems}
                      recognitionLevel={exp.recognition_level_id}
                      setExpressions={updateExpressions}
                  />
              )
        }
      </section>

      <Footer />
    </div>
  )
}
