'use client';
import Link from 'next/link'; import { FormEvent, useEffect, useState } from 'react'; import { api } from '../../lib/api';
type Dataset={id:string,name:string,description?:string,_count:{records:number}};
export default function Page(){
 const [items,setItems]=useState<Dataset[]>([]),[name,setName]=useState(''),[description,setDescription]=useState(''),[error,setError]=useState('');
 async function load(){try{setItems(await api('/datasets'))}catch(e:any){setError(e.message+' - sign in first')}} useEffect(()=>{load()},[]);
 async function create(e:FormEvent){e.preventDefault();try{await api('/datasets',{method:'POST',body:JSON.stringify({name,description})});setName('');setDescription('');load()}catch(e:any){setError(e.message)}}
 async function remove(id:string){if(confirm('Delete this dataset and all its records?')){await api('/datasets/'+id,{method:'DELETE'});load()}}
 return <main className="shell"><h1>Datasets</h1><p className="muted">Create a workspace, import data, and filter real records.</p>{error&&<p className="error">{error}</p>}<div className="grid"><form className="card" onSubmit={create}><h2>New dataset</h2><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Product catalogue" required/><label>Description</label><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Products for the Lagos store"/><button>Create dataset</button></form><section>{items.map(x=><article className="card" key={x.id}><h2>{x.name}</h2><p>{x.description}</p><p><strong>{x._count.records}</strong> records</p><div className="row"><Link className="button" href={`/datasets/${x.id}`}>Open</Link><button className="danger" onClick={()=>remove(x.id)}>Delete</button></div></article>)}{!items.length&&<div className="card">No datasets yet.</div>}</section></div></main>
}
