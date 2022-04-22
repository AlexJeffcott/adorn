import { FC, useEffect, useState } from 'react';
import { TextNodesFromDOM, Match, annotateDOM } from 'annotate';
import { ipsumCaseSensitive, ipsumCaseInsensitive } from 'test-utils';
import './index.css';

const opts = { tag: 'x-annotate' };
const match = new Match(ipsumCaseInsensitive, ipsumCaseSensitive, opts);
const textNodesFromDOM = new TextNodesFromDOM(document.body, [opts.tag.toUpperCase()]);

const Ipsum: FC = () => {
	const [showH4, setShowH4] = useState(false);
	const [showH5, setShowH5] = useState(false);

	useEffect(() => {
		annotateDOM(textNodesFromDOM.walk(document.body), match);
		const scrollCB = textNodesFromDOM.watchScroll((ns: Node[]) => annotateDOM(ns, match));
		return () => textNodesFromDOM.endWatchScroll(scrollCB);
	}, [showH4, showH5]);

	return (
		<div className="content">
			<h1>Lorem Ipsum</h1>
			{showH4 ? (
				<h4>
					&quot;Neque porro quisquam est qui dolorem <i>ipsum</i> quia dolor sit amet, consectetur,
					adipisci velit...&quot;
				</h4>
			) : (
				<button onClick={() => setShowH4(true)}>show h4</button>
			)}
			{showH5 ? (
				<h5>
					&quot;There is no one who loves pain itself, who seeks after it and wants to have it,
					simply because it is pain...&quot;
				</h5>
			) : (
				<button onClick={() => setShowH5(true)}>show h5</button>
			)}

			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
				<a href="http://loripsum.net/" target="_blank" rel="noreferrer">
					Equidem e Cn.
				</a>{' '}
				Atque etiam valítudinem, vires, vacuitatem doloris non propter utilitatem solum, sed etiam
				ipsas propter se expetemus. Etenim semper illud extra est, quod arte comprehenditur. Duo
				Reges: constructio interrete.{' '}
				<b>Quae diligentissime contra Aristonem dicuntur a Chryippo.</b>{' '}
				<code>Mihi enim satis est, ipsis non satis.</code> Mihi enim erit isdem istis fortasse iam
				utendum.{' '}
			</p>

			<p>
				Quae quidem vel cum periculo est quaerenda vobis; Facile pateremur, qui etiam nunc agendi
				aliquid discendique causa prope contra naturam vígillas suscipere soleamus. Itaque ne
				iustitiam quidem recte quis dixerit per se ipsam optabilem, sed quia iucunditatis vel
				plurimum afferat. Quae contraria sunt his, malane?{' '}
				<a href="http://loripsum.net/" target="_blank" rel="noreferrer">
					Quae contraria sunt his, malane?
				</a>{' '}
				Ita ne hoc quidem modo paria peccata sunt.{' '}
			</p>

			<pre>
				Vos autem, Cato, quia virtus, ut omnes fatemur, altissimum locum in homine et maxime
				excellentem tenet, et quod eos, qui sapientes sunt, absolutos et perfectos putamus, aciem
				animorum nostrorum virtutis splendore praestringitis. Atqui haec patefactio quasi rerum
				opertarum, cum quid quidque sit aperitur, definitio est.
			</pre>

			<ul>
				<li>Quae cum dixisset, finem ille.</li>
				<li>
					Et si turpitudinem fugimus in statu et motu corporis, quid est cur pulchritudinem non
					sequamur?
				</li>
			</ul>

			<p>
				Et quidem iure fortasse, sed tamen non gravissimum est testimonium multitudinis. Quis est
				tam dissimile homini. Indicant pueri, in quibus ut in speculis natura cernitur. Iam quae
				corporis sunt, ea nec auctoritatem cum animi partibus, comparandam et cognitionem habent
				faciliorem. Expectoque quid ad id, quod quaerebam, respondeas.{' '}
				<b>Honesta oratio, Socratica, Platonis etiam.</b>{' '}
				<i>Quod ea non occurrentia fingunt, vincunt Aristonem;</i> <i>Nihil enim hoc differt.</i>{' '}
				Cum id fugiunt, re eadem defendunt, quae Peripatetici, verba.{' '}
			</p>

			<p>
				Est igitur officium eius generis, quod nec in bonis ponatur nec in contrariis. Quam ob rem
				tandem, inquit, non satisfacit? Ut in voluptate sit, qui epuletur, in dolore, qui
				torqueatur. Ex quo intellegitur officium medium quiddam esse, quod neque in bonis ponatur
				neque in contrariis. Ne in odium veniam, si amicum destitero tueri.{' '}
				<i>Poterat autem inpune;</i> Quis istud, quaeso, nesciebat? Sed quanta sit alias, nunc
				tantum possitne esse tanta. <i>At ego quem huic anteponam non audeo dicere;</i> Et quidem,
				Cato, hanc totam copiam iam Lucullo nostro notam esse oportebit; Aliena dixit in physicis
				nec ea ipsa, quae tibi probarentur; Quorum sine causa fieri nihil putandum est.{' '}
			</p>

			<ul>
				<li>
					Alia quaedam dicent, credo, magna antiquorum esse peccata, quae ille veri investigandi
					cupidus nullo modo ferre potuerit.
				</li>
				<li>Sed quod proximum fuit non vidit.</li>
				<li>Ea possunt paria non esse.</li>
				<li>Laelius clamores sofòw ille so lebat Edere compellans gumias ex ordine nostros.</li>
				<li>Quae cum dixisset paulumque institisset, Quid est?</li>
			</ul>

			<h2>Quem Tiberina descensio festo illo die tanto gaudio affecit, quanto L.</h2>

			<p>
				Te ipsum, dignissimum maioribus tuis, voluptasne induxit, ut adolescentulus eriperes P.{' '}
				<code>Etenim semper illud extra est, quod arte comprehenditur.</code> Atqui iste locus est,
				Piso, tibi etiam atque etiam confirmandus, inquam; Quippe: habes enim a rhetoribus; Illa
				argumenta propria videamus, cur omnia sint paria peccata. Verba tu fingas et ea dicas, quae
				non sentias? <i>At ille pellit, qui permulcet sensum voluptate.</i>{' '}
				<i>Verum hoc idem saepe faciamus.</i>{' '}
			</p>

			<h5>Quam ob rem tandem, inquit, non satisfacit?</h5>

			<p>
				<code>Addidisti ad extremum etiam indoctum fuisse.</code> Quid de Platone aut de Democrito
				loquar? Quam tu ponis in verbis, ego positam in re putabam. Cur deinde Metrodori liberos
				commendas? An vero, inquit, quisquam potest probare, quod perceptfum, quod.{' '}
				<i>Quonam, inquit, modo?</i> Quid est, quod ab ea absolvi et perfici debeat?{' '}
			</p>

			<dl>
				<dt>
					<dfn>Ut pulsi recurrant?</dfn>
				</dt>
				<dd>Cur fortior sit, si illud, quod tute concedis, asperum et vix ferendum putabit?</dd>
				<dt>
					<dfn>Reguli reiciendam;</dfn>
				</dt>
				<dd>
					An eum locum libenter invisit, ubi Demosthenes et Aeschines inter se decertare soliti
					sunt?
				</dd>
				<dt>
					<dfn>Quis hoc dicit?</dfn>
				</dt>
				<dd>Quantum Aristoxeni ingenium consumptum videmus in musicis?</dd>
				<dt>
					<dfn>Quis negat?</dfn>
				</dt>
				<dd>Quod quidem nobis non saepe contingit.</dd>
				<dt>
					<dfn>Quis hoc dicit?</dfn>
				</dt>
				<dd>Qua tu etiam inprudens utebare non numquam.</dd>
				<dt>
					<dfn>Quid vero?</dfn>
				</dt>
				<dd>
					Facit enim ille duo seiuncta ultima bonorum, quae ut essent vera, coniungi debuerunt;
				</dd>
			</dl>

			<ol>
				<li>Quo studio Aristophanem putamus aetatem in litteris duxisse?</li>
				<li>Nunc omni virtuti vitium contrario nomine opponitur.</li>
				<li>
					Maximeque eos videre possumus res gestas audire et legere velle, qui a spe gerendi absunt
					confecti senectute.
				</li>
				<li>Verum tamen cum de rebus grandioribus dicas, ipsae res verba rapiunt;</li>
				<li>Honesta oratio, Socratica, Platonis etiam.</li>
				<li>
					Transfer idem ad modestiam vel temperantiam, quae est moderatio cupiditatum rationi
					oboediens.
				</li>
			</ol>

			<dl>
				<dt>
					<dfn>At certe gravius.</dfn>
				</dt>
				<dd>
					Ut enim consuetudo loquitur, id solum dicitur honestum, quod est populari fama gloriosum.
				</dd>
				<dt>
					<dfn>Sedulo, inquam, faciam.</dfn>
				</dt>
				<dd>Urgent tamen et nihil remittunt.</dd>
				<dt>
					<dfn>Quid ergo?</dfn>
				</dt>
				<dd>Quos quidem tibi studiose et diligenter tractandos magnopere censeo.</dd>
				<dt>
					<dfn>Proclivi currit oratio.</dfn>
				</dt>
				<dd>Ego vero volo in virtute vim esse quam maximam;</dd>
				<dt>
					<dfn>Iam enim adesse poterit.</dfn>
				</dt>
				<dd>An quod ita callida est, ut optime possit architectari voluptates?</dd>
				<dt>
					<dfn>Sed nimis multa.</dfn>
				</dt>
				<dd>Quae si potest singula consolando levare, universa quo modo sustinebit?</dd>
			</dl>

			<h1>Aliena dixit in physicis nec ea ipsa, quae tibi probarentur;</h1>

			<p>
				<mark>Et quod est munus, quod opus sapientiae?</mark> Alterum significari idem, ut si
				diceretur, officia media omnia aut pleraque servantem vivere. Num quid tale Democritus?{' '}
				<a href="http://loripsum.net/" target="_blank" rel="noreferrer">
					Quod equidem non reprehendo;
				</a>{' '}
				Ut in geometria, prima si dederis, danda sunt omnia. Sed ad haec, nisi molestum est, habeo
				quae velim. <code>An eiusdem modi?</code> Equidem etiam Epicurum, in physicis quidem,
				Democriteum puto.{' '}
			</p>

			<blockquote cite="http://loripsum.net">
				Inest in eadem explicatione naturae insatiabilis quaedam e cognoscendis rebus voluptas,in
				qua una confectis rebus necessariis vacui negotiis honeste ac liberaliter possimus vivere.
			</blockquote>

			<p>
				Quo modo autem optimum, si bonum praeterea nullum est? Non semper, inquam; Ita multo
				sanguine profuso in laetitia et in victoria est mortuus.{' '}
				<b>Scisse enim te quis coarguere possit?</b> Apparet statim, quae sint officia, quae
				actiones. Quod quidem nobis non saepe contingit. Sed ut iis bonis erigimur, quae expectamus,
				sic laetamur iis, quae recordamur.{' '}
			</p>

			<pre>
				Quid ei reliquisti, nisi te, quoquo modo loqueretur, intellegere, quid diceret? Si alia
				sentit, inquam, alia loquitur, numquam intellegam quid sentiat;
			</pre>

			<ol>
				<li>Te enim iudicem aequum puto, modo quae dicat ille bene noris.</li>
				<li>Ne amores quidem sanctos a sapiente alienos esse arbitrantur.</li>
				<li>De quibus cupio scire quid sentias.</li>
			</ol>

			<h3>Quae quo sunt excelsiores, eo dant clariora indicia naturae.</h3>

			<p>
				<code>Cur id non ita fit?</code> Quae sequuntur igitur? Quam nemo umquam voluptatem
				appellavit, appellat; <b>Et non ex maxima parte de tota iudicabis?</b>{' '}
			</p>

			<ol>
				<li>Nondum autem explanatum satis, erat, quid maxime natura vellet.</li>
				<li>Commoda autem et incommoda in eo genere sunt, quae praeposita et reiecta diximus;</li>
				<li>Itaque haec cum illis est dissensio, cum Peripateticis nulla sane.</li>
				<li>Eademne, quae restincta siti?</li>
			</ol>

			<h2>Istam voluptatem perpetuam quis potest praestare sapienti?</h2>

			<p>
				Sed quid attinet de rebus tam apertis plura requirere? Qui non moveatur et offensione
				turpitudinis et comprobatione honestatis? <i>Inquit, dasne adolescenti veniam?</i> Frater et
				T.{' '}
				<a href="http://loripsum.net/" target="_blank" rel="noreferrer">
					Inde sermone vario sex illa a Dipylo stadia confecimus.
				</a>{' '}
				Non quaeritur autem quid naturae tuae consentaneum sit, sed quid disciplinae. Aliud igitur
				esse censet gaudere, aliud non dolere. Idem iste, inquam, de voluptate quid sentit?{' '}
			</p>

			<p>
				Tum Triarius: Posthac quidem, inquit, audacius. Ad eas enim res ab Epicuro praecepta dantur.
				Serpere anguiculos, nare anaticulas, evolare merulas, cornibus uti videmus boves, nepas
				aculeis. <i>Unum est sine dolore esse, alterum cum voluptate.</i> Quid, quod homines infima
				fortuna, nulla spe rerum gerendarum, opifices denique delectantur historia? An vero, inquit,
				quisquam potest probare, quod perceptfum, quod. Habent enim et bene longam et satis
				litigiosam disputationem.{' '}
			</p>

			<p>
				Non autem hoc: igitur ne illud quidem. Quare conare, quaeso. Hoc enim constituto in
				philosophia constituta sunt omnia. Quod idem cum vestri faciant, non satis magnam tribuunt
				inventoribus gratiam. Eaedem res maneant alio modo. Minime vero, inquit ille, consentit.{' '}
				<code>Quae cum dixisset, finem ille.</code>{' '}
			</p>

			<dl>
				<dt>
					<dfn>Moriatur, inquit.</dfn>
				</dt>
				<dd>Quia dolori non voluptas contraria est, sed doloris privatio.</dd>
				<dt>
					<dfn>Nos commodius agimus.</dfn>
				</dt>
				<dd>Quid, de quo nulla dissensio est?</dd>
				<dt>
					<dfn>Avaritiamne minuis?</dfn>
				</dt>
				<dd>Maximus dolor, inquit, brevis est.</dd>
				<dt>
					<dfn>Perge porro;</dfn>
				</dt>
				<dd>An tu me de L.</dd>
				<dt>
					<dfn>Confecta res esset.</dfn>
				</dt>
				<dd>Negat enim summo bono afferre incrementum diem.</dd>
				<dt>
					<dfn>Murenam te accusante defenderem.</dfn>
				</dt>
				<dd>Quae cum ita sint, effectum est nihil esse malum, quod turpe non sit.</dd>
			</dl>

			<blockquote cite="http://loripsum.net">
				Iam argumenti ratione conclusi caput esse faciunt ea, quae perspicua dicunt, deinde ordinem
				sequuntur, tum, quid verum sit in singulis, extrema conclusio est.
			</blockquote>

			<h4>Nunc ita separantur, ut disiuncta sint, quo nihil potest esse perversius.</h4>

			<p>
				Quamquam ab iis philosophiam et omnes ingenuas disciplinas habemus; Age nunc isti doceant,
				vel tu potius quis enim ista melius?{' '}
			</p>

			<h6>Non igitur bene.</h6>

			<p>
				<b>Quae cum essent dicta, discessimus.</b> Quia nec honesto quic quam honestius nec turpi
				turpius. Cum ageremus, inquit, vitae beatum et eundem supremum diem, scribebamus haec. Bonum
				patria: miserum exilium. Atqui perspicuum est hominem e corpore animoque constare, cum
				primae sint animi partes, secundae corporis. <b>Sin aliud quid voles, postea.</b>{' '}
				<code>Quantum Aristoxeni ingenium consumptum videmus in musicis?</code>{' '}
			</p>

			<blockquote cite="http://loripsum.net">
				Satis est tibi in te, satis in legibus, satis in mediocribus amicitiis praesidii.
			</blockquote>

			<pre>
				Ne id quidem, nisi multa annorum intercesserint milia, ut omnium siderum eodem, unde
				profecta sint, fiat ad unum tempus reversio. At negat Epicurus-hoc enim vestrum lumen
				estquemquam, qui honeste non vivat, iucunde posse vivere.
			</pre>

			<ul>
				<li>Conferam tecum, quam cuique verso rem subicias;</li>
				<li>Et ille ridens: Video, inquit, quid agas;</li>
			</ul>

			<p>
				<i>Sed mehercule pergrata mihi oratio tua.</i> Quacumque enim ingredimur, in aliqua historia
				vestigium ponimus. Quos quidem tibi studiose et diligenter tractandos magnopere censeo.
				Egone non intellego, quid sit don Graece, Latine voluptas? Quod praeceptum quia maius erat,
				quam ut ab homine videretur, idcirco assignatum est deo. Quid ad utilitatem tantae pecuniae?
				Nam et complectitur verbis, quod vult, et dicit plane, quod intellegam; Haec para/doca illi,
				nos admirabilia dicamus.
			</p>
		</div>
	);
};

export default Ipsum;
