import CDP from "chrome-remote-interface";
import ProtocolApi from "devtools-protocol/types/protocol-proxy-api";

// workaround for type declaration issues in cdp lib
type ForceClientT = {
  Profiler: ProtocolApi.ProfilerApi;
  Page: ProtocolApi.PageApi;
  Tracing: ProtocolApi.TracingApi;
  Network: ProtocolApi.NetworkApi;
};

async function trace(url: string) {
  let client: ForceClientT;
  const response: any[] = [];
  let profile: any;
  try {
    /**
     * Establish a client to the chrome devtools opened with remote debugging port
     * http://127.0.0.1:9222/
     */
    client = (await CDP({ port: 9222 })) as unknown as ForceClientT;
    const { Network, Page, Profiler } = client;
    await Promise.all([
      Network.enable({}),
      Page.enable(),
      Profiler.enable(),
      Profiler.setSamplingInterval({ interval: 100 }),
    ]);
    await Profiler.start();
    /**
     * Register a callback to intercept all the requests
     */
    Network.on("responseReceived", (params) => response.push(params.response));

    //Navigate to the url
    await Page.navigate({ url });

    //Wait for the page to load
    await Page.on("loadEventFired", (params) => {});
    profile = await Profiler.stop().then((p) => p.profile);
  } catch (err) {
    console.error(err);
  }
  // finally {
  //   if (client) {
  //     await client.close();
  //   }
  // }
  // @ts-ignore
  client.close();
  return { response, profile };
}

function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const val = item[key];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
}

/**
 * Get all the response, group and count them by mime-type.
 */
const fn = async () => {
  const { response } = await trace("https://github.com");
  const groupedByType = groupBy(response, "mimeType");
  const countByType = Object.keys(groupedByType).map((k) => {
    const count = groupedByType[k].length;
    return {
      type: k,
      count,
    };
  });

  console.log(countByType);
};

const getProfile = async () => {
  const { profile } = await trace("http://localhost:9222/e2e");
  console.log("|> profile ===> ", profile);
};

// fn();
getProfile();
